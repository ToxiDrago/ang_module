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

  constructor(
    private orderService: OrdersService,
    private userService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((data) => {
      console.log('user', data);
    });
    this.initOrders();
  }

  ngOnDestroy() {
    this._destroyer?.unsubscribe();
  }

  initOrders() {
    this.orders$ = this.orderService.getOrders();
  }
}
