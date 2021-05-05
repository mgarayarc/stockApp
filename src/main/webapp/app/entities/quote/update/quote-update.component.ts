import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuote, Quote } from '../quote.model';
import { QuoteService } from '../service/quote.service';
import { IStock } from 'app/entities/stock/stock.model';
import { StockService } from 'app/entities/stock/service/stock.service';

@Component({
  selector: 'jhi-quote-update',
  templateUrl: './quote-update.component.html',
})
export class QuoteUpdateComponent implements OnInit {
  isSaving = false;

  stocksSharedCollection: IStock[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    open: [],
    high: [],
    low: [],
    close: [null, [Validators.required]],
    adjclose: [null, [Validators.required]],
    volume: [],
    stock: [],
  });

  constructor(
    protected quoteService: QuoteService,
    protected stockService: StockService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ quote }) => {
      this.updateForm(quote);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const quote = this.createFromForm();
    if (quote.id !== undefined) {
      this.subscribeToSaveResponse(this.quoteService.update(quote));
    } else {
      this.subscribeToSaveResponse(this.quoteService.create(quote));
    }
  }

  trackStockById(index: number, item: IStock): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuote>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(quote: IQuote): void {
    this.editForm.patchValue({
      id: quote.id,
      date: quote.date,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      adjclose: quote.adjclose,
      volume: quote.volume,
      stock: quote.stock,
    });

    this.stocksSharedCollection = this.stockService.addStockToCollectionIfMissing(this.stocksSharedCollection, quote.stock);
  }

  protected loadRelationshipsOptions(): void {
    this.stockService
      .query()
      .pipe(map((res: HttpResponse<IStock[]>) => res.body ?? []))
      .pipe(map((stocks: IStock[]) => this.stockService.addStockToCollectionIfMissing(stocks, this.editForm.get('stock')!.value)))
      .subscribe((stocks: IStock[]) => (this.stocksSharedCollection = stocks));
  }

  protected createFromForm(): IQuote {
    return {
      ...new Quote(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      open: this.editForm.get(['open'])!.value,
      high: this.editForm.get(['high'])!.value,
      low: this.editForm.get(['low'])!.value,
      close: this.editForm.get(['close'])!.value,
      adjclose: this.editForm.get(['adjclose'])!.value,
      volume: this.editForm.get(['volume'])!.value,
      stock: this.editForm.get(['stock'])!.value,
    };
  }
}
