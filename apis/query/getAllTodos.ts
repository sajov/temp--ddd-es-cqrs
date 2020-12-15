import { RequestHandler } from 'express';
import { ViewStore } from '../../stores/ViewStore';

const getAllTodos = function ({ viewStore }: {
  viewStore: ViewStore;
}): RequestHandler {
  return function (req, res): void {
    viewStore.allTodos.find(
      {},
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _id: 0
      },
      (err: Error | null, allTodos: unknown): void => {
        if (err) {
          return res.status(500).end();
        }

        res.json(allTodos);
      }
    );
  };
};

export { getAllTodos };
