import { EventPublisher } from '../../publishers/EventPublisher';
import { EventStore } from '../../stores/EventStore';
import { getDrop } from './getDrop';
import { getEdit } from './getEdit';
import { getMarkAsDone } from './getMarkAsDone';
import { getNote } from './getNote';
import { getRevertMarkAsDone } from './getRevertMarkAsDone';
import { json } from 'body-parser';
import express, { Application } from 'express';

const getCommandApi = function ({ eventStore, eventPublisher }: {
  eventStore: EventStore;
  eventPublisher: EventPublisher;
}): Application {
  const commandApi = express();

  commandApi.use(json());

  commandApi.post('/organizing/todo/note', getNote({ eventStore, eventPublisher }));
  commandApi.post('/organizing/todo/edit', getEdit({ eventStore, eventPublisher }));
  commandApi.post('/organizing/todo/mark-as-done', getMarkAsDone({ eventStore, eventPublisher }));
  commandApi.post('/organizing/todo/revert-mark-as-done', getRevertMarkAsDone({ eventStore, eventPublisher }));
  commandApi.post('/organizing/todo/drop', getDrop({ eventStore, eventPublisher }));

  return commandApi;
};

export { getCommandApi };
