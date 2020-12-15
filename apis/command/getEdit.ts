import { Command } from '../../elements/Command';
import { Event } from '../../elements/Event';
import { EventPublisher } from '../../publishers/EventPublisher';
import { EventStore } from '../../stores/EventStore';
import { flaschenpost } from 'flaschenpost';
import { RequestHandler } from 'express';
import { Todo } from '../../domain/organizing/Todo';
import { Value } from 'validate-value';

const logger = flaschenpost.getLogger();

const requestBodySchema = new Value({
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    description: { type: 'string', minLength: 1 }
  },
  required: [ 'id', 'description' ],
  additionalProperties: false
});

const getEdit = function ({ eventStore, eventPublisher }: {
  eventStore: EventStore;
  eventPublisher: EventPublisher;
}): RequestHandler {
  return (req, res): void => {
    if (!requestBodySchema.isValid(req.body)) {
      return res.status(400).end();
    }

    res.status(200).end();

    const { id, description } = req.body;

    const contextIdentifier = { name: 'organizing' };
    const aggregateIdentifier = { name: 'todo', id };

    const editCommand = new Command({
      contextIdentifier,
      aggregateIdentifier,
      name: 'edit',
      data: { description },
      metadata: { timestamp: Date.now() }
    });

    logger.info('Command received.', { command: editCommand });

    const todo = new Todo({ contextIdentifier, aggregateIdentifier });
    const events = eventStore.getEvents({ contextIdentifier, aggregateIdentifier });

    todo.replay({ events });

    try {
      todo.edit({ command: editCommand });
    } catch (ex: unknown) {
      logger.error('Failed to edit todo.', { command: editCommand, ex });

      eventPublisher.publish({
        event: new Event({
          contextIdentifier,
          aggregateIdentifier,
          name: 'editFailed',
          data: { reason: (ex as Error).message },
          metadata: { timestamp: Date.now() }
        })
      });

      return;
    }

    logger.info('Todo edited.', { command: editCommand });

    for (const unstoredEvent of todo.unstoredEvents) {
      eventStore.storeEvent({ event: unstoredEvent });
      eventPublisher.publish({ event: unstoredEvent });
    }
  };
};

export { getEdit };
