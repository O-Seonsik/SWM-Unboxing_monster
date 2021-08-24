export class openResult {
  readonly openResults: OpenResults[];
  readonly openDistribution: OpenDistribution[];
}

class OpenResults {
  readonly id: number;
  readonly boxId: number;
  readonly userId: string;
  readonly itemId: number;
}

class OpenDistribution {
  readonly itemId: number;
  readonly _count: _Count;
}

class _Count {
  readonly itemId: number;
}
