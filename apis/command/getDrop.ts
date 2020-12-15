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

const getDrop = function ({ eventStore, eventPublisher }: {
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

    const dropCommand = new Command({
      contextIdentifier,
      aggregateIdentifier,
      name: 'drop',
      data: {},
      metadata: { timestamp: Date.now() }
    });

    logger.info('Command received.', { command: dropCommand });

    const todo = new Todo({ contextIdentifier, aggregateIdentifier });
    const events = eventStore.getEvents({ contextIdentifier, aggregateIdentifier });

    todo.replay({ events });

    // const snapshot = snapshotStore.getSnapshot({ contextIdentifier, aggregateIdentifier });
    // const events = snapshot ?
    //   eventStore.getEvents({ contextIdentifier, aggregateIdentifier, from: snapshot.revision + 1 }) :
    //   eventStore.getEvents({ contextIdentifier, aggregateIdentifier });
    //
    // todo.applySnapshot({ snapshot });
    // todo.replay({ events });
    //
    // if (shallNewSnapshotBeTaken) {
    //   snapshotStore.storeSnapshot({
    //     contextIdentifier,
    //     aggregateIdentifier,
    //     snapshot: todo.getState(),
    //     revision: todo.revision
    //   });
    // }

    try {
      todo.drop({ command: dropCommand });
    } catch (ex: unknown) {
      logger.error('Failed to drop todo.', { command: dropCommand, ex });

      eventPublisher.publish({
        event: new Event({
          contextIdentifier,
          aggregateIdentifier,
          name: 'dropFailed',
          data: { reason: (ex as Error).message },
          metadata: { timestamp: Date.now() }
        })
      });

      return;
    }

    logger.info('Todo dropped.', { command: dropCommand });

    for (const unstoredEvent of todo.unstoredEvents) {
      eventStore.storeEvent({ event: unstoredEvent });
      eventPublisher.publish({ event: unstoredEvent });
    }
  };
};

export { getDrop };
