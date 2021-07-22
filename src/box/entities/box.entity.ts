export class BoxEntity {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly ownerId: string;
  readonly items: Item[];
}

class Item {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly image: string;
  readonly detail: string;
}
