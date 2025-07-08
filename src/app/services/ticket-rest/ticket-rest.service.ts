import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { INearestTour, ITour, ITourLocation } from '../../models/tours';

@Injectable({
  providedIn: 'root',
})
export class TicketRestService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<ITour[]> {
    return this.http.get<ITour[]>(`${this.apiUrl}/tours`);
  }

  generateTours(): Observable<any> {
    return this.http.post(`${this.apiUrl}/tours/generate`, {});
  }

  deleteTours(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tours`);
  }

  getRestError(): Observable<any> {
    return this.http.get<any>(
      'https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/tours/notFound'
    );
  }

  getNearestTickets() {
    return this.http.get<INearestTour[]>(
      'https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/nearestTours/'
    );
  }

  getLocationList() {
    return this.http.get<ITourLocation[]>(
      'https://62b9e756ff109cd1dc9dae16.mockapi.io/apiv/v1/location/'
    );
  }

  getRandomNearestEvent(type: number) {
    return this.http.get(`/assets/mocks/nearestTours${type + 1}.json`);
  }

  sendTourData(data: any) {
    return this.http.post(`/`, data);
  }

  getTicketById(id: string) {
    return this.http.get<ITour>(`${this.apiUrl}/tours/${id}`);
  }
}
