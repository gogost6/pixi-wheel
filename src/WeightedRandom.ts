export interface WeightedEntry<T> {
  value: T;
  weight: number;
}

export class WeightedRandom<T> {
  private entries: WeightedEntry<T>[];
  private totalWeight: number;

  constructor(entries: WeightedEntry<T>[]) {
    if (entries.length === 0)
      throw new Error("WeightedRandom requires at least one entry");
    this.entries = entries;
    this.totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  }

  pick(): T {
    let rand = Math.random() * this.totalWeight;
    for (const entry of this.entries) {
      rand -= entry.weight;
      if (rand <= 0) return entry.value;
    }
    return this.entries[this.entries.length - 1].value;
  }

  /** Build a WeightedRandom where each successive value has weight = base^(-index),
   *  so later (bigger) entries get progressively lower chances. */
  static fromDecaying<T>(values: T[], base = 2): WeightedRandom<T> {
    const entries = values.map((value, i) => ({
      value,
      weight: Math.pow(base, -i),
    }));
    return new WeightedRandom(entries);
  }
}
