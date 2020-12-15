import { AggregateIdentifier } from '../elements/AggregateIdentifier';
import { ContextIdentifier } from '../elements/ContextIdentifier';
import { Event } from '../elements/Event';

class EventStore {
  private readonly events: Event<unknown>[];

  public constructor () {
    this.events = [];
  }

  public storeEvent ({ event }: {
    event: Event<unknown>;
  }): void {
    this.events.push(event);
  }

  public getEvents ({ contextIdentifier, aggregateIdentifier }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
  }): Event<unknown>[] {
    return this.events.filter((event): boolean =>
      event.contextIdentifier.name === contextIdentifier.name &&
      event.aggregateIdentifier.name === aggregateIdentifier.name &&
      event.aggregateIdentifier.id === aggregateIdentifier.id);
  }
}

export { EventStore };
