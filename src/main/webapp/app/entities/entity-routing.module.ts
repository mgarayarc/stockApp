import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'stock',
        data: { pageTitle: 'stockApp.stock.home.title' },
        loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
      },
      {
        path: 'quote',
        data: { pageTitle: 'stockApp.quote.home.title' },
        loadChildren: () => import('./quote/quote.module').then(m => m.QuoteModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
