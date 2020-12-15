import { getCommandApi } from './command/getCommandApi';
import { getEventsApi } from './events/getEventsApi';
import { getQueryApi } from './query/getQueryApi';
import express, { Application } from 'express';

const getApi = function (): Application {
  const api = express();

  const commandApi = getCommandApi();
  const eventsApi = getEventsApi();
  const queryApi = getQueryApi();

  api.use('/command', commandApi);
  api.use('/events', eventsApi);
  api.use('/query', queryApi);

  return api;
};

export { getApi };
