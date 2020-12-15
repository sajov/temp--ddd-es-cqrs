import { EventPublisher } from '../../publishers/EventPublisher';
import { getEvents } from './getEvents';
import express, { Application } from 'express';

const getEventsApi = function ({ eventPublisher }: {
  eventPublisher: EventPublisher;
}): Application {
  const eventsApi = express();

  eventsApi.get('/', getEvents({ eventPublisher }));

  return eventsApi;
};

export { getEventsApi };
