import { allTodos } from './projections/allTodos';
import { EventPublisher } from './publishers/EventPublisher';
import { EventStore } from './stores/EventStore';
import { flaschenpost } from 'flaschenpost';
import { getApi } from './apis/getApi';
import http from 'http';
import { processenv } from 'processenv';
import View from 'nedb';
import { ViewStore } from './stores/ViewStore';

const logger = flaschenpost.getLogger();

const port = processenv('PORT', 3_000) as number;

const eventStore = new EventStore();
const eventPublisher = new EventPublisher();

const viewStore: ViewStore = {
  allTodos: new View()
};

allTodos({ eventPublisher, viewStore });

const api = getApi({ eventStore, eventPublisher, viewStore });
const server = http.createServer(api);

server.listen(port, (): void => {
  logger.info('Server started.', { port });
});
