import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../app.settings';


@Injectable({
  providedIn: 'root'
})
export class HistoricalService {
  private appSettings = AppSettings;
  private ws!: WebSocket;
  private websocketUrl = this.appSettings.websocketUrl;

  private apiKey = this.appSettings.apiKey;
  private priceSubject = new Subject<any>();
  private selectedCrypto?: string;
  private messageQueue: any[] = [];
  private isConnected = false;

  constructor(private http: HttpClient) {
    this.initWebSocket();
   }


   private initWebSocket(): void {
    this.ws = new WebSocket(this.websocketUrl);

    this.ws.onopen = () => this.onOpen();
    this.ws.onmessage = (event) => this.onMessage(event);
    this.ws.onerror = (error) => console.error('WebSocket error:', error);
    this.ws.onclose = () => this.onClose();
  }

  private onOpen(): void {
    console.log('WebSocket connection opened');
    this.isConnected = true;
    this.processQueue();
    if (this.selectedCrypto) {
      this.updateSubscription('subscribe', this.selectedCrypto);
    }
  }

  private onMessage(event: MessageEvent): void {
    const data = JSON.parse(event.data);
    if (data && data.price) {
      this.priceSubject.next(data);
    }
  }

  private onClose(): void {
    console.log('WebSocket connection closed');
    this.isConnected = false;
  }

  private processQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  private sendMessage(message: any): void {
    if (this.isConnected) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  private updateSubscription(type: 'subscribe' | 'unsubscribe', crypto: string): void {
    this.sendMessage({
      type,
      apikey: this.apiKey,
      heartbeat: false,
      subscribe_data_type: ['trade'],
      subscribe_filter_symbol_id: [crypto]
    });
  }

  getPriceUpdates(): Observable<any> {
    return this.priceSubject.asObservable();
  }

  setSelectedCrypto(crypto: string): void {
    if (this.selectedCrypto) {
      this.updateSubscription('unsubscribe', this.selectedCrypto);
    }
    this.selectedCrypto = crypto;
    this.updateSubscription('subscribe', crypto);
  }

  
}
