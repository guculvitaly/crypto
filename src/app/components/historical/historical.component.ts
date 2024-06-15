import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { HistoricalService } from '../../services/historical.service';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-historical',
  standalone: true,
  imports: [ChartModule,ProgressSpinnerModule,CommonModule,CardModule],
  providers: [DatePipe],
  templateUrl: './historical.component.html',
  styleUrl: './historical.component.css',
  
})
export class HistoricalComponent {
  @Input() isSubscribed!: boolean;
  @Input() cryptoSymbolId!: string;
  @Input() labelForDataSet!: string;

  data: any;
  options: any;
  isUpdating: boolean = false;
  isDataLoaded: boolean = false;
  cryptoPrice: any;
  lastUpdate: Date | undefined;
  wsSubscription: Subscription | undefined;
  dataSet: number[] = [];
  labelData: string[] = [];
  userTimeZone: string | undefined;

  constructor(private historicalService: HistoricalService, private datePipe: DatePipe) { }


  ngOnInit(): void {
    this.historicalService.setSelectedCrypto(this.cryptoSymbolId);
    this.userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');



    this.historicalService.getPriceUpdates().subscribe(resp => {
      if (resp) {
        this.isDataLoaded = true;
        const date = new Date(resp.time_exchange);
        let time_exchange = this.datePipe.transform(date, 'yyyy.MM.dd HH:mm:ss', this.userTimeZone);
        this.dataSet.push(resp.price);
        this.labelData.push(time_exchange!);
        this.data = {
          labels: this.labelData,
          datasets: [
            {
              label: this.labelForDataSet,
              data: this.dataSet,
              fill: false,
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              tension: 0.4
            }
          ]
        };
        this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
            legend: {
              labels: {
                color: textColor
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
            y: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            }
          }
        };
      }

    });
  }



}

