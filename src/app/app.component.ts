import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CryptoDisplayComponent } from "./components/crypto-display/crypto-display.component";
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ButtonModule, CryptoDisplayComponent]
})
export class AppComponent {
  title = 'crypto-market-app';
}
