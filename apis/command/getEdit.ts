import { Command } from '../../elements/Command';
import { flaschenpost } from 'flaschenpost';
import { RequestHandler } from 'express';
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

const getEdit = function (): RequestHandler {
  return (req, res): void => {
    if (!requestBodySchema.isValid(req.body)) {
      return res.status(400).end();
    }

    res.status(200).end();

    const { id, description } = req.body;

    const editCommand = new Command({
      contextIdentifier: { name: 'organizing' },
      aggregateIdentifier: { name: 'todo', id },
      name: 'edit',
      data: { description },
      metadata: { timestamp: Date.now() }
    });

    logger.info('Command received.', { command: editCommand });
  };
};

export { getEdit };
