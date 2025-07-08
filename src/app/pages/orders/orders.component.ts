import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IOrder } from '../../models/orders';
import { OrdersService } from '../../services/orders/orders.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders$: Observable<IOrder[]>;
  private _destroyer: Subscription;
  page = 1;
  limit = 5;

  constructor(
    private orderService: OrdersService,
    private userService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((data) => {
      console.log('user', data);
    });
    this.loadOrders();
  }

  ngOnDestroy() {
    this._destroyer?.unsubscribe();
  }

  loadOrders() {
    this.orders$ = this.orderService.getOrdersPaged(this.page, this.limit);
  }

  nextPage() {
    this.page++;
    this.loadOrders();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadOrders();
    }
  }

  setLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1;
    this.loadOrders();
  }
}
