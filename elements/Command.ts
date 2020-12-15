import { AggregateIdentifier } from './AggregateIdentifier';
import { CommandMetadata } from './CommandMetadata';
import { ContextIdentifier } from './ContextIdentifier';
import { v4 as uuid } from 'uuid';

class Command {
  public readonly contextIdentifier: ContextIdentifier;

  public readonly aggregateIdentifier: AggregateIdentifier;

  public readonly name: string;

  public readonly id: string;

  public readonly data: object;

  public readonly metadata: CommandMetadata;

  public constructor ({
    contextIdentifier,
    aggregateIdentifier,
    name,
    data = {},
    metadata
  }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
    name: string;
    data: object;
    metadata: CommandMetadata;
  }) {
    this.contextIdentifier = contextIdentifier;
    this.aggregateIdentifier = aggregateIdentifier;
    this.name = name;
    this.id = uuid();
    this.data = data;
    this.metadata = metadata;
  }
}

export { Command };
