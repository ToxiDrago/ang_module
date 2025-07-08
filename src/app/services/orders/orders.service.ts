import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { IOrder } from '../../models/orders';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private apiUrl = 'http://localhost:3000/orders';
  private groupOrdersSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.apiUrl, order);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setGroupOrders(value: boolean) {
    this.groupOrdersSubject.next(value);
  }

  getGroupOrders$() {
    return this.groupOrdersSubject.asObservable();
  }

  getOrdersPaged(page: number, limit: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }
}
