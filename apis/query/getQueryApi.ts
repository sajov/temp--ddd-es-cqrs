import { getAllTodos } from './getAllTodos';
import { ViewStore } from '../../stores/ViewStore';
import express, { Application } from 'express';

const getQueryApi = function ({ viewStore }: {
  viewStore: ViewStore;
}): Application {
  const queryApi = express();

  queryApi.get('/all-todos', getAllTodos({ viewStore }));

  return queryApi;
};

export { getQueryApi };
