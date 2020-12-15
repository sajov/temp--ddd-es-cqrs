import { AggregateIdentifier } from './AggregateIdentifier';
import { ContextIdentifier } from './ContextIdentifier';
import { Event } from './Event';

class Aggregate {
  protected contextIdentifier: ContextIdentifier;

  protected aggregateIdentifier: AggregateIdentifier;

  private isExistent: boolean;

  public constructor ({ contextIdentifier, aggregateIdentifier }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
  }) {
    this.contextIdentifier = contextIdentifier;
    this.aggregateIdentifier = aggregateIdentifier;
    this.isExistent = false;
  }

  public replay ({ events }: {
    events: Event<unknown>[];
  }): void {
    for (const event of events) {
      (this as any)[event.name]({ event: event as Event<any> });
      this.isExistent = true;
    }
  }

  protected exists (): boolean {
    return this.isExistent;
  }

  protected publishEvent<TEventData> (eventName: string, eventData: TEventData): void {
    const event = new Event({
      contextIdentifier: this.contextIdentifier,
      aggregateIdentifier: this.aggregateIdentifier,
      name: eventName,
      data: eventData,
      metadata: { timestamp: Date.now() }
    });

    // ...
  }
}

export { Aggregate };
