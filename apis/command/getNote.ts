import { Command } from '../../elements/Command';
import { Event } from '../../elements/Event';
import { EventPublisher } from '../../publishers/EventPublisher';
import { EventStore } from '../../stores/EventStore';
import { flaschenpost } from 'flaschenpost';
import { RequestHandler } from 'express';
import { Todo } from '../../domain/organizing/Todo';
import { v4 as uuid } from 'uuid';
import { Value } from 'validate-value';

const logger = flaschenpost.getLogger();

const requestBodySchema = new Value({
  type: 'object',
  properties: {
    description: { type: 'string', minLength: 1 }
  },
  required: [ 'description' ],
  additionalProperties: false
});

const getNote = function ({ eventStore, eventPublisher }: {
  eventStore: EventStore;
  eventPublisher: EventPublisher;
}): RequestHandler {
  return (req, res): void => {
    if (!requestBodySchema.isValid(req.body)) {
      return res.status(400).end();
    }

    res.status(200).end();

    const { description } = req.body;

    const contextIdentifier = { name: 'organizing' };
    const aggregateIdentifier = { name: 'todo', id: uuid() };

    const noteCommand = new Command({
      contextIdentifier,
      aggregateIdentifier,
      name: 'note',
      data: { description },
      metadata: { timestamp: Date.now() }
    });

    logger.info('Command received.', { command: noteCommand });

    const todo = new Todo({ contextIdentifier, aggregateIdentifier });
    const events = eventStore.getEvents({ contextIdentifier, aggregateIdentifier });

    todo.replay({ events });

    try {
      todo.note({ command: noteCommand });
    } catch (ex: unknown) {
      logger.error('Failed to note todo.', { command: noteCommand, ex });

      eventPublisher.publish({
        event: new Event({
          contextIdentifier,
          aggregateIdentifier,
          name: 'noteFailed',
          data: { reason: (ex as Error).message },
          metadata: { timestamp: Date.now() }
        })
      });

      return;
    }

    logger.info('Todo noted.', { command: noteCommand });

    for (const unstoredEvent of todo.unstoredEvents) {
      eventStore.storeEvent({ event: unstoredEvent });
      eventPublisher.publish({ event: unstoredEvent });
    }
  };
};

export { getNote };
