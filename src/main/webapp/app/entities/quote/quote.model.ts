import * as dayjs from 'dayjs';
import { IStock } from 'app/entities/stock/stock.model';

export interface IQuote {
  id?: number;
  date?: dayjs.Dayjs;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  close?: number;
  adjclose?: number;
  volume?: number | null;
  stock?: IStock | null;
}

export class Quote implements IQuote {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public open?: number | null,
    public high?: number | null,
    public low?: number | null,
    public close?: number,
    public adjclose?: number,
    public volume?: number | null,
    public stock?: IStock | null
  ) {}
}

export function getQuoteIdentifier(quote: IQuote): number | undefined {
  return quote.id;
}
