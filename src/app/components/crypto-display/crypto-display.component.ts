
import { Component } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { PanelModule } from 'primeng/panel';
import { CommonModule,DatePipe } from '@angular/common';
import { ListboxModule } from 'primeng/listbox';
import {FormsModule} from "@angular/forms";
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HistoricalComponent } from "../historical/historical.component";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
interface Crypto {
  name: string;
  code: string;
  symbol_Id: string
}

@Component({
    selector: 'app-crypto-display',
    standalone: true,
    templateUrl: './crypto-display.component.html',
    styleUrl: './crypto-display.component.css',
    imports: [
        CommonModule,
        PanelModule,
        ListboxModule,
        FormsModule,
        DropdownModule,
        ButtonModule,
        CardModule,
        HistoricalComponent,
        ProgressSpinnerModule,
        MessagesModule
    ],
    providers: [DatePipe]
})
export class CryptoDisplayComponent {
  cryptoPrice: any;
  lastUpdate!: string | null;
  cryptos!: Crypto[] | undefined;
  symbol: any;
  selectedCrypto: Crypto | any;
  isUpdating: boolean = false;
  isSubscribe: boolean = false;
  symbol_Id!: string;
  labelDataset!: string;
isDisabledBtn: boolean = true;
hasError: boolean = false;
errorMessage: string = '';
  constructor(private cryptoService: CryptoService, private datePipe: DatePipe) { }
  
  ngOnInit(): void {

    this.cryptos = [
      { name: 'BTC/USD', code: 'BTC', symbol_Id: 'BITSTAMP_SPOT_BTC_USD' },
      { name: 'ETH/USD', code: 'ETH',symbol_Id: 'BITSTAMP_SPOT_ETH_USD' },

  ];
    
  }

  onChangeDropdown():void{
    this.isDisabledBtn = false;
    this.hasError = false;
    this.labelDataset = this.selectedCrypto.code;
    const query = this.selectedCrypto!.code;
    this.cryptoService.getCryptoPrice(query, 'USD').pipe(
      catchError(error => {
        this.handleError(error);
        return of(null);
      })
    ).subscribe(data => {
      if (data && data.time){
        const date = new Date(data.time);
        let time = this.datePipe.transform(date, 'MMM dd, HH:mm');
        this.cryptoPrice = data.rate;
        this.symbol = data.asset_id_base + '/' + data.asset_id_quote;
        this.lastUpdate = time
      }
     
    });
  }

  onSubscrButtonClick():void{
    this.isSubscribe = true;
    this.symbol_Id = this.selectedCrypto.symbol_Id;
  }

  handleError(error: any): void{
    console.error('An error occurred:', error);
    this.hasError = true;
    this.errorMessage = JSON.stringify(error.error.error);
  }
 }
