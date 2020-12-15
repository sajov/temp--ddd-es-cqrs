import { Aggregate } from '../../elements/Aggregate';
import { AggregateIdentifier } from '../../elements/AggregateIdentifier';
import { Command } from '../../elements/Command';
import { ContextIdentifier } from '../../elements/ContextIdentifier';
import { Event } from '../../elements/Event';

class Todo extends Aggregate {
  private description: string;

  private isDone: boolean;

  private isDropped: boolean;

  public constructor ({ contextIdentifier, aggregateIdentifier }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
  }) {
    super({ contextIdentifier, aggregateIdentifier });

    this.description = '';
    this.isDone = false;
    this.isDropped = false;
  }

  // Commands

  public note ({ command }: {
    command: Command<{ description: string }>;
  }): void {
    if (this.exists()) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already noted.`);
    }

    this.publishEvent('noted', { description: command.data.description });
  }

  public edit ({ command }: {
    command: Command<{ description: string }>;
  }): void {
    if (!this.exists()) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was not yet noted.`);
    }
    if (this.isDone) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already marked as done.`);
    }
    if (this.isDropped) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already dropped.`);
    }

    this.publishEvent('edited', { description: command.data.description });
  }

  public markAsDone ({ command }: {
    command: Command<Record<string, never>>;
  }): void {
    if (!this.exists()) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was not yet noted.`);
    }
    if (this.isDone) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already marked as done.`);
    }
    if (this.isDropped) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already dropped.`);
    }

    this.publishEvent('markedAsDone', {});
  }

  public revertMarkAsDone ({ command }: {
    command: Command<Record<string, never>>;
  }): void {
    if (!this.exists()) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was not yet noted.`);
    }
    if (!this.isDone) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was not yet marked as done.`);
    }
    if (this.isDropped) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already dropped.`);
    }

    this.publishEvent('markAsDoneReverted', {});
  }

  public drop ({ command }: {
    command: Command<Record<string, never>>;
  }): void {
    if (!this.exists()) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was not yet noted.`);
    }
    if (this.isDropped) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already dropped.`);
    }

    this.publishEvent('dropped', {});
  }

  // Events

  public noted ({ event }: {
    event: Event<{ description: string }>;
  }): void {
    this.description = event.data.description;
  }

  public edited ({ event }: {
    event: Event<{ description: string }>;
  }): void {
    this.description = event.data.description;
  }

  public markedAsDone ({ event }: {
    event: Event<{ description: string }>;
  }): void {
    this.isDone = true;
  }

  public markAsDoneReverted ({ event }: {
    event: Event<{ description: string }>;
  }): void {
    this.isDone = false;
  }

  public dropped ({ event }: {
    event: Event<{ description: string }>;
  }): void {
    this.isDropped = true;
  }
}

export { Todo };
