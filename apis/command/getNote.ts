import { Command } from '../../elements/Command';
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

const getNote = function ({ eventStore }: {
  eventStore: EventStore;
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
    todo.note({ command: noteCommand });
  };
};

export { getNote };
