import { AggregateIdentifier } from './AggregateIdentifier';
import { ContextIdentifier } from './ContextIdentifier';
import { EventMetadata } from './EventMetadata';
import { v4 as uuid } from 'uuid';

class Event<TEventData> {
  public readonly contextIdentifier: ContextIdentifier;

  public readonly aggregateIdentifier: AggregateIdentifier;

  public readonly name: string;

  public readonly id: string;

  public readonly data: TEventData;

  public readonly metadata: EventMetadata;

  public constructor ({
    contextIdentifier,
    aggregateIdentifier,
    name,
    data,
    metadata
  }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
    name: string;
    data: TEventData;
    metadata: EventMetadata;
  }) {
    this.contextIdentifier = contextIdentifier;
    this.aggregateIdentifier = aggregateIdentifier;
    this.name = name;
    this.id = uuid();
    this.data = data;
    this.metadata = metadata;
  }
}

export { Event };
