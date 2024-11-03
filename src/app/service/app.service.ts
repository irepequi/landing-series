import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiSeries = 'http://localhost:3000/series';
  private apiReviews = 'http://localhost:3000/reviews';

  constructor(private http: HttpClient) {}

  /**
   * Devuelve un array con todas las series ordenados por el título de manera ascendente.
   */
  getSeries(): Observable<any> {
    return this.http.get(`${this.apiSeries}?_sort=title&_order=asc`);
  }

  /**
   * Guarda y sube la información de la nueva serie que se crea.
   * @param {any} serie - es toda la información de la serie que se va a añadir.
   */
  setSerie(serie: any): Observable<any> {
    return this.http.post(this.apiSeries, serie);
  }

  /**
   * Devuelve un array con todas las series ordenados por el título de manera ascendente.
   */
  getReviews(): Observable<any> {
    return this.http.get(this.apiReviews);
  }

  /**
   * Guarda y sube la información de la nueva review que se crea para el usuario.
   * @param {any} serie - es toda la información de la serie sobre la que se va a
   * añadir una nueva review.
   */
  setReview(serie: any): Observable<any> {
    const newApiUrl = `${this.apiReviews}/?title=${serie.title}`;
    return this.http.post(newApiUrl, serie);
  }
}
