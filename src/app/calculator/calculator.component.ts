import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../services/calculator.service';
import { GecmisIslemlerService, IslemGecmisi } from '../services/gecmis-islemler.service';
import { IkiBasamakliPipe } from '../pipes/iki-basamakli.pipe';
import { GecmisIslemlerComponent } from './gecmis-islemler/gecmis-islemler.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, IkiBasamakliPipe, GecmisIslemlerComponent],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  // Ekrandaki görünen değer
  ekranDegeri$ = new BehaviorSubject<string>('0');
  
  // Hesaplama değişkenleri
  mevcutGirdi = '0';
  ilkSayi: number | null = null;
  operator: string | null = null;
  ikinciSayiBekliyor = false;
  
  // İşlem ekranında gösterilen değer
  islemMetni = '';

  constructor(
    private hesapMakinesiServisi: CalculatorService,
    private gecmisIslemlerServisi: GecmisIslemlerService
  ) {}
  
  // Klavye olaylarını dinle
  @HostListener('keydown', ['$event'])
  klavyeOlayiniDinle(event: KeyboardEvent): void {
    // Tuş kodunu engelle (sayfanın kaymasını önlemek için)
    if (['+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace', 'Delete'].includes(event.key)) {
      event.preventDefault();
    }
    
    // Sayılar ve nokta
    if (/^[0-9.]$/.test(event.key)) {
      this.butonaTiklandi(event.key);
    }
    // Operatörler
    else if (['+', '-', '*', '/'].includes(event.key)) {
      this.butonaTiklandi(event.key);
    }
    // Enter = Eşittir
    else if (event.key === 'Enter' || event.key === '=') {
      this.butonaTiklandi('=');
    }
    // Escape = Temizle
    else if (event.key === 'Escape') {
      this.butonaTiklandi('C');
    }
    // Backspace veya Delete = Geri al
    else if (event.key === 'Backspace' || event.key === 'Delete') {
      this.butonaTiklandi('backspace');
    }
  }

  // Buton tıklaması için ana fonksiyon
  butonaTiklandi(deger: string): void {
    // Sayı veya nokta ise
    if (this.sayiMi(deger) || deger === '.') {
      this.sayiGirildi(deger);
    } 
    // Operatör ise (+, -, *, /)
    else if (['+', '-', '*', '/'].includes(deger)) {
      this.operatorGirildi(deger);
    } 
    // Eşittir ise
    else if (deger === '=') {
      this.hesapla();
    } 
    // Temizle ise
    else if (deger === 'C') {
      this.temizle();
    } 
    // Geri al ise
    else if (deger === 'backspace') {
      this.geriAl();
    }
  }

  // Sayı kontrolü
  private sayiMi(deger: string): boolean {
    return /^\d+$/.test(deger);
  }

  // Sayı girişi
  private sayiGirildi(deger: string): void {
    // Operatörden sonra yeni sayı girişi
    if (this.ikinciSayiBekliyor) {
      this.mevcutGirdi = deger;
      this.ikinciSayiBekliyor = false;
      this.islemMetniniGuncelle(this.mevcutGirdi);
    } 
    // Normal sayı girişi
    else {
      // Nokta kontrolü
      if (deger === '.' && this.mevcutGirdi.includes('.')) {
        return;
      }
      
      // Sayıyı ekle
      this.mevcutGirdi = this.mevcutGirdi === '0' && deger !== '.' ? 
                         deger : 
                         this.mevcutGirdi + deger;
      
      // İşlem ekranını güncelle
      if (this.operator !== null) {
        this.islemMetniniGuncelle(this.mevcutGirdi);
      }
    }
    
    // Ekranı güncelle
    this.ekraniGuncelle();
  }

  // Operatör işleme
  private operatorGirildi(operator: string): void {
    const girilenDeger = parseFloat(this.mevcutGirdi);
    
    // İlk sayı girişi
    if (this.ilkSayi === null) {
      this.ilkSayi = girilenDeger;
      this.islemMetni = `${girilenDeger} ${this.operatorSemboluGetir(operator)}`;
    } 
    // Zaten bir operatör varsa, önce mevcut işlemi yap
    else if (this.operator) {
      try {
        // Hesaplamayı yap
        const sonuc = this.hesapMakinesiServisi.calculate(this.ilkSayi, girilenDeger, this.operator);
        
        // Geçmiş işleme ekle
        this.islemGecmisineEkle(this.ilkSayi, girilenDeger, this.operator, sonuc);
        
        this.mevcutGirdi = String(sonuc);
        this.ilkSayi = sonuc;
        this.ekraniGuncelle();
        
        // İşlem ekranını güncelle
        this.islemMetni = `${sonuc} ${this.operatorSemboluGetir(operator)}`;
      } catch (hata) {
        if (hata instanceof Error) {
          this.mevcutGirdi = hata.message;
          this.ekraniGuncelle();
          this.islemMetni = '';
          this.ilkSayi = null;
          this.operator = null;
          this.ikinciSayiBekliyor = false;
          return;
        }
      }
    }
    
    // Bir sonraki sayı girişi için hazırla
    this.ikinciSayiBekliyor = true;
    this.operator = operator;
  }

  // Hesaplama işlemi
  private hesapla(): void {
    // Gerekli veriler yoksa çık
    if (this.ilkSayi === null || this.operator === null) return;
    
    const girilenDeger = parseFloat(this.mevcutGirdi);
    try {
      // Hesaplamayı yap
      const sonuc = this.hesapMakinesiServisi.calculate(this.ilkSayi, girilenDeger, this.operator);
      
      // Geçmiş işleme ekle
      this.islemGecmisineEkle(this.ilkSayi, girilenDeger, this.operator, sonuc);
      
      // İşlem ekranını güncelle
      this.islemMetni = `${this.ilkSayi} ${this.operatorSemboluGetir(this.operator)} ${girilenDeger} = `;
      
      // Sonucu ekrana yaz
      this.mevcutGirdi = String(sonuc);
      this.ekraniGuncelle();
      
      // Değişkenleri sıfırla
      this.ilkSayi = null;
      this.operator = null;
      this.ikinciSayiBekliyor = false;
    } catch (hata) {
      if (hata instanceof Error) {
        this.mevcutGirdi = hata.message;
        this.ekraniGuncelle();
        this.islemMetni = '';
      }
      this.ilkSayi = null;
      this.operator = null;
      this.ikinciSayiBekliyor = false;
    }
  }

  // Temizleme işlemi
  private temizle(): void {
    this.mevcutGirdi = '0';
    this.ilkSayi = null;
    this.operator = null;
    this.ikinciSayiBekliyor = false;
    this.islemMetni = '';
    this.ekraniGuncelle();
  }

  // Geri alma işlemi
  private geriAl(): void {
    if (this.mevcutGirdi.length > 1) {
      this.mevcutGirdi = this.mevcutGirdi.slice(0, -1);
      
      // İşlem ekranını güncelle
      if (this.operator !== null) {
        this.islemMetniniGuncelle(this.mevcutGirdi);
      }
    } else {
      this.mevcutGirdi = '0';
      
      // İşlem ekranını güncelle
      if (this.operator !== null) {
        this.islemMetniniGuncelle('0');
      }
    }
    this.ekraniGuncelle();
  }

  // Ekranı güncelleme
  private ekraniGuncelle(): void {
    this.ekranDegeri$.next(this.mevcutGirdi);
  }
  
  // İşlem ekranını güncelleme
  private islemMetniniGuncelle(girilenDeger: string): void {
    if (this.ilkSayi !== null && this.operator !== null) {
      this.islemMetni = `${this.ilkSayi} ${this.operatorSemboluGetir(this.operator)} ${girilenDeger}`;
    }
  }
  
  // Operatör sembolünü alma
  private operatorSemboluGetir(operator: string): string {
    switch(operator) {
      case '+': return '+';
      case '-': return '-';
      case '*': return '×';
      case '/': return '÷';
      default: return operator;
    }
  }
  
  // İşlemi geçmişe ekle
  private islemGecmisineEkle(ilkSayi: number, ikinciSayi: number, operator: string, sonuc: number): void {
    const yeniIslem: IslemGecmisi = {
      ilkSayi: ilkSayi,
      ikinciSayi: ikinciSayi,
      operator: operator,
      sonuc: sonuc,
      tarih: new Date()
    };
    
    this.gecmisIslemlerServisi.islemEkle(yeniIslem);
  }
} 