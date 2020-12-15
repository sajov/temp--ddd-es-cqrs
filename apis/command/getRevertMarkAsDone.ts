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
    id: { type: 'string', format: 'uuid' }
  },
  required: [ 'id' ],
  additionalProperties: false
});

const getRevertMarkAsDone = function ({ eventStore, eventPublisher }: {
  eventStore: EventStore;
  eventPublisher: EventPublisher;
}): RequestHandler {
  return (req, res): void => {
    if (!requestBodySchema.isValid(req.body)) {
      return res.status(400).end();
    }

    res.status(200).end();

    const { id } = req.body;

    const contextIdentifier = { name: 'organizing' };
    const aggregateIdentifier = { name: 'todo', id };

    const revertMarkAsDoneCommand = new Command({
      contextIdentifier,
      aggregateIdentifier,
      name: 'revertMarkAsDone',
      data: {},
      metadata: { timestamp: Date.now() }
    });

    logger.info('Command received.', { command: revertMarkAsDoneCommand });

    const todo = new Todo({ contextIdentifier, aggregateIdentifier });
    const events = eventStore.getEvents({ contextIdentifier, aggregateIdentifier });

    todo.replay({ events });

    try {
      todo.revertMarkAsDone({ command: revertMarkAsDoneCommand });
    } catch (ex: unknown) {
      logger.error('Failed to revert mark todo as done.', { command: revertMarkAsDoneCommand, ex });

      eventPublisher.publish({
        event: new Event({
          contextIdentifier,
          aggregateIdentifier,
          name: 'revertAsMarkDoneFailed',
          data: { reason: (ex as Error).message },
          metadata: { timestamp: Date.now() }
        })
      });

      return;
    }

    logger.info('Reverted mark todo as done.', { command: revertMarkAsDoneCommand });

    for (const unstoredEvent of todo.unstoredEvents) {
      eventStore.storeEvent({ event: unstoredEvent });
      eventPublisher.publish({ event: unstoredEvent });
    }
  };
};

export { getRevertMarkAsDone };
