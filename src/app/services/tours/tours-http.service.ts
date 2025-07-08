import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITour } from '../../models/tours';

@Injectable({ providedIn: 'root' })
export class ToursHttpService {
  private apiUrl = 'http://localhost:3000/tours';

  constructor(private http: HttpClient) {}

  getTours(): Observable<ITour[]> {
    return this.http.get<ITour[]>(this.apiUrl);
  }

  addTour(tour: ITour): Observable<ITour> {
    return this.http.post<ITour>(this.apiUrl, tour);
  }

  updateTour(id: string, tour: Partial<ITour>): Observable<ITour> {
    return this.http.put<ITour>(`${this.apiUrl}/${id}`, tour);
  }

  deleteTour(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  generateTours() {
    return this.http.post(`${this.apiUrl}/generate`, {});
  }

  uploadTour(formData: FormData): Observable<ITour> {
    return this.http.post<ITour>(`${this.apiUrl}/upload`, formData);
  }

  searchToursByName(name: string): Observable<ITour[]> {
    return this.http.get<ITour[]>(
      `${this.apiUrl}/search?name=${encodeURIComponent(name)}`
    );
  }
}
