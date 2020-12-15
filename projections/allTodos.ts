import { Event } from '../elements/Event';
import { EventPublisher } from '../publishers/EventPublisher';
import { ViewStore } from '../stores/ViewStore';

const allTodos = function ({ eventPublisher, viewStore }: {
  eventPublisher: EventPublisher;
  viewStore: ViewStore;
}): void {
  eventPublisher.subscribe({
    callback ({ event }): void {
      switch (event.getFullName()) {
        case 'organizing.todo.noted': {
          const notedEvent = event as Event<{ description: string }>;

          viewStore.allTodos.insert({
            id: notedEvent.aggregateIdentifier.id,
            timestamp: notedEvent.metadata.timestamp,
            description: notedEvent.data.description,
            isDone: false
          });
          break;
        }

        case 'organizing.todo.edited': {
          const editedEvent = event as Event<{ description: string }>;

          viewStore.allTodos.update({
            id: editedEvent.aggregateIdentifier.id
          }, {
            $set: { description: editedEvent.data.description }
          });
          break;
        }

        case 'organizing.todo.markedAsDone': {
          const markedAsDoneEvent = event as Event<Record<string, never>>;

          viewStore.allTodos.update({
            id: markedAsDoneEvent.aggregateIdentifier.id
          }, {
            $set: { isDone: true }
          });
          break;
        }

        case 'organizing.todo.markAsDoneReverted': {
          const revertedMarkAsDoneEvent = event as Event<Record<string, never>>;

          viewStore.allTodos.update({
            id: revertedMarkAsDoneEvent.aggregateIdentifier.id
          }, {
            $set: { isDone: false }
          });
          break;
        }

        case 'organizing.todo.dropped': {
          const droppedEvent = event as Event<Record<string, never>>;

          viewStore.allTodos.remove({
            id: droppedEvent.aggregateIdentifier.id
          });
          break;
        }

        default: {
          // Intentionally left blank.
        }
      }
    }
  });
};

export { allTodos };
