import { EventPublisher } from '../../publishers/EventPublisher';
import { RequestHandler } from 'express';

const getEvents = function ({ eventPublisher }: {
  eventPublisher: EventPublisher;
}): RequestHandler {
  return function (req, res): void {
    res.writeHead(200, {
      'content-type': 'x-application/nd-json'
    });

    res.write(`${JSON.stringify({ ping: 'pong' })}\n`);

    setInterval((): void => {
      res.write(`${JSON.stringify({ ping: 'pong' })}\n`);
    }, 90_000);

    eventPublisher.subscribe({
      callback ({ event }): void {
        res.write(`${JSON.stringify(event)}\n`);
      }
    });
  };
};

export { getEvents };
