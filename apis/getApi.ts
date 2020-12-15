import { EventPublisher } from '../publishers/EventPublisher';
import { EventStore } from '../stores/EventStore';
import { getCommandApi } from './command/getCommandApi';
import { getEventsApi } from './events/getEventsApi';
import { getQueryApi } from './query/getQueryApi';
import express, { Application } from 'express';

const getApi = function ({ eventStore, eventPublisher }: {
  eventStore: EventStore;
  eventPublisher: EventPublisher;
}): Application {
  const api = express();

  const commandApi = getCommandApi({ eventStore, eventPublisher });
  const eventsApi = getEventsApi({ eventPublisher });
  const queryApi = getQueryApi();

  api.use('/command', commandApi);
  api.use('/events', eventsApi);
  api.use('/query', queryApi);

  return api;
};

export { getApi };
