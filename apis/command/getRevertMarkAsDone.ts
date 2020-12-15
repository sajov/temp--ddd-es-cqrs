import { Command } from '../../elements/Command';
import { flaschenpost } from 'flaschenpost';
import { RequestHandler } from 'express';
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

const getRevertMarkAsDone = function (): RequestHandler {
  return (req, res): void => {
    if (!requestBodySchema.isValid(req.body)) {
      return res.status(400).end();
    }

    res.status(200).end();

    const { id } = req.body;

    const revertMarkAsDoneCommand = new Command({
      contextIdentifier: { name: 'organizing' },
      aggregateIdentifier: { name: 'todo', id },
      name: 'revertMarkAsDone',
      metadata: { timestamp: Date.now() }
    });

    logger.info('Command received.', { command: revertMarkAsDoneCommand });
  };
};

export { getRevertMarkAsDone };
