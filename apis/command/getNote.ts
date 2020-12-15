import { Command } from '../../elements/Command';
import { flaschenpost } from 'flaschenpost';
import { RequestHandler } from 'express';
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

const getNote = function (): RequestHandler {
  return (req, res): void => {
    if (!requestBodySchema.isValid(req.body)) {
      return res.status(400).end();
    }

    res.status(200).end();

    const { description } = req.body;

    const noteCommand = new Command({
      contextIdentifier: { name: 'organizing' },
      aggregateIdentifier: { name: 'todo', id: uuid() },
      name: 'note',
      data: { description },
      metadata: { timestamp: Date.now() }
    });

    logger.info('Command received.', { command: noteCommand });
  };
};

export { getNote };
