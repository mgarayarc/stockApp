import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuote } from '../quote.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { QuoteService } from '../service/quote.service';
import { QuoteDeleteDialogComponent } from '../delete/quote-delete-dialog.component';
import { IStock, Stock } from 'app/entities/stock/stock.model';
import { StockService } from 'app/entities/stock/service/stock.service';

@Component({
  selector: 'jhi-quote',
  templateUrl: './quote.component.html',
})
export class QuoteComponent implements OnInit {
  stocks?: IStock[];
  selectedStock?: Stock;
  startDate?: Date;
  endDate?: Date;
  stockQuotes?: IQuote[];

  quotes?: IQuote[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected quoteService: QuoteService,
    protected stockService: StockService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  searchQuotes(): void {
    this.quoteService.queryByStock().subscribe((res: HttpResponse<IQuote[]>) => {
      this.stockQuotes = res.body ?? [];
    });
  }

  getStocks(): void {
    this.stockService.query().subscribe((res: HttpResponse<IStock[]>) => {
      this.stocks = res.body ?? [];
    });
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.quoteService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IQuote[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    this.getStocks();
    this.handleNavigation();
  }

  trackId(index: number, item: IQuote): number {
    return item.id!;
  }

  delete(quote: IQuote): void {
    const modalRef = this.modalService.open(QuoteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.quote = quote;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IQuote[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/quote'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.quotes = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
