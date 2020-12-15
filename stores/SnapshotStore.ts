import { AggregateIdentifier } from '../elements/AggregateIdentifier';
import { ContextIdentifier } from '../elements/ContextIdentifier';

class SnapshotStore {
  private readonly snapshots: Record<string, { revision: number; snapshot: unknown } | undefined>;

  public constructor () {
    this.snapshots = {};
  }

  public storeSnapshot ({ contextIdentifier, aggregateIdentifier, snapshot, revision }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
    snapshot: unknown;
    revision: number;
  }): void {
    const key = `${contextIdentifier.name}.${aggregateIdentifier.name}.${aggregateIdentifier.id}`;
    const value = { snapshot, revision };

    this.snapshots[key] = value;
  }

  public getSnapshot ({ contextIdentifier, aggregateIdentifier }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
  }): {
      snapshot: unknown;
      revision: number;
    } | undefined {
    const key = `${contextIdentifier.name}.${aggregateIdentifier.name}.${aggregateIdentifier.id}`;
    const value = this.snapshots[key];

    return value;
  }
}

export { SnapshotStore };
