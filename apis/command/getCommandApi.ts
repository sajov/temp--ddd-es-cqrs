import { getDrop } from './getDrop';
import { getEdit } from './getEdit';
import { getMarkAsDone } from './getMarkAsDone';
import { getNote } from './getNote';
import { getRevertMarkAsDone } from './getRevertMarkAsDone';
import { json } from 'body-parser';
import express, { Application } from 'express';

const getCommandApi = function (): Application {
  const commandApi = express();

  commandApi.use(json());

  commandApi.post('/organizing/todo/note', getNote());
  commandApi.post('/organizing/todo/edit', getEdit());
  commandApi.post('/organizing/todo/mark-as-done', getMarkAsDone());
  commandApi.post('/organizing/todo/revert-mark-as-done', getRevertMarkAsDone());
  commandApi.post('/organizing/todo/drop', getDrop());

  return commandApi;
};

export { getCommandApi };
