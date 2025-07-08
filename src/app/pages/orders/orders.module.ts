import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrdersHeaderComponent } from './orders-header/orders-header.component';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [OrdersComponent, OrdersHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    OrdersRoutingModule,
    TreeTableModule,
    CheckboxModule,
  ],
})
export class OrdersModule {}
