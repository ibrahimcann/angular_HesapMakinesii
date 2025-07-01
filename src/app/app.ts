import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalculatorComponent } from './calculator/calculator.component';
import { GecmisIslemlerComponent } from './calculator/gecmis-islemler/gecmis-islemler.component';
import { IkiBasamakliPipe } from './pipes/iki-basamakli.pipe';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CalculatorComponent, 
    GecmisIslemlerComponent, 
    IkiBasamakliPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'hesap_makinesi';
}
