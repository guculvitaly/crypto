import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private appSettings = AppSettings;
  constructor(private http: HttpClient) { }

  getCryptoPrice(crypto: string, currency: string): Observable<any> {
    return this.http.get(`${this.appSettings.apiUrl}/${crypto}/${currency}`)
  }
}
