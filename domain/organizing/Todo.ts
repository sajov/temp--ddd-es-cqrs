import { Aggregate } from '../../elements/Aggregate';
import { AggregateIdentifier } from '../../elements/AggregateIdentifier';
import { Command } from '../../elements/Command';
import { ContextIdentifier } from '../../elements/ContextIdentifier';
import { Event } from '../../elements/Event';

class Todo extends Aggregate {
  private description: string;

  private readonly isDone: boolean;

  public constructor ({ contextIdentifier, aggregateIdentifier }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
  }) {
    super({ contextIdentifier, aggregateIdentifier });

    this.description = '';
    this.isDone = false;
  }

  public note ({ command }: {
    command: Command<{ description: string }>;
  }): void {
    if (this.exists()) {
      throw new Error(`Todo '${this.aggregateIdentifier.id}' was already noted.`);
    }

    this.publishEvent('noted', { description: command.data.description });
  }

  public noted ({ event }: {
    event: Event<{ description: string }>;
  }): void {
    this.description = event.data.description;
  }
}

export { Todo };
