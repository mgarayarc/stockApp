export interface IStock {
  id?: number;
  symbol?: string;
  name?: string;
}

export class Stock implements IStock {
  constructor(public id?: number, public symbol?: string, public name?: string) {}
}

export function getStockIdentifier(stock: IStock): number | undefined {
  return stock.id;
}
