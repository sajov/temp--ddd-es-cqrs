import { Event } from '../elements/Event';
import { EventEmitter } from 'events';

class EventPublisher extends EventEmitter {
  public publish ({ event }: {
    event: Event<unknown>;
  }): void {
    this.emit('event', { event });
  }

  public subscribe ({ callback }: {
    callback: ({ event }: { event: Event<unknown> }) => void;
  }): void {
    this.on('event', callback);
  }
}

export { EventPublisher };
