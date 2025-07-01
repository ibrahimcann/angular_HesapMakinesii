import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GecmisIslemlerService, IslemGecmisi } from '../../services/gecmis-islemler.service';
import { IkiBasamakliPipe } from '../../pipes/iki-basamakli.pipe';

@Component({
  selector: 'app-gecmis-islemler',
  standalone: true,
  imports: [CommonModule, IkiBasamakliPipe],
  templateUrl: './gecmis-islemler.component.html',
  styleUrls: ['./gecmis-islemler.component.scss']
})
export class GecmisIslemlerComponent implements OnInit {
  // Geçmiş işlemler listesi
  gecmisIslemler: IslemGecmisi[] = [];

  constructor(private gecmisIslemlerService: GecmisIslemlerService) {}

  ngOnInit(): void {
    // Geçmiş işlemleri servisten abone ol
    this.gecmisIslemlerService.islemGecmisiniGetir().subscribe(islemler => {
      this.gecmisIslemler = islemler;
    });
  }

  /**
   * Operatör sembolünü görüntülemek için yardımcı metot
   * @param operator Operatör ('+', '-', '*', '/')
   * @returns Görüntülenecek sembol
   */
  operatorSemboluGetir(operator: string): string {
    switch(operator) {
      case '+': return '+';
      case '-': return '-';
      case '*': return '×';
      case '/': return '÷';
      default: return operator;
    }
  }

  /**
   * Tüm geçmiş işlemleri temizler
   */
  gecmisiTemizle(): void {
    this.gecmisIslemlerService.gecmisiTemizle();
  }
  
  /**
   * Tarih ve saat formatını düzenler
   * @param tarih Tarih objesi
   * @returns Formatlanmış tarih ve saat
   */
  tarihFormati(tarih: Date): string {
    const saat = new Date(tarih).getHours();
    const dakika = new Date(tarih).getMinutes();
    
    // İki basamaklı olması için
    const ikiBasamakliSaat = saat < 10 ? `0${saat}` : saat;
    const ikiBasamakliDakika = dakika < 10 ? `0${dakika}` : dakika;
    
    return `${ikiBasamakliSaat}:${ikiBasamakliDakika}`;
  }
} 