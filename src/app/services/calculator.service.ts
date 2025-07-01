import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  constructor() {}

  /**
   * İki sayı arasında matematik işlemi yapar
   * @param ilkSayi Birinci sayı (sol taraftaki sayı)
   * @param ikinciSayi İkinci sayı (sağ taraftaki sayı)
   * @param operator İşlem operatörü ('+', '-', '*', '/')
   * @returns İşlem sonucu
   */
  calculate(ilkSayi: number, ikinciSayi: number, operator: string): number {
    let sonuc: number;

    // Her işlem basit ve doğrudan kendi operatörü ile hesaplanıyor
    if (operator === '+') {
      // Toplama işlemi
      sonuc = ilkSayi + ikinciSayi;
    } 
    else if (operator === '-') {
      // Çıkarma işlemi
      sonuc = ilkSayi - ikinciSayi;
    } 
    else if (operator === '*') {
      // Çarpma işlemi
      sonuc = ilkSayi * ikinciSayi;
    } 
    else if (operator === '/') {
      // Bölme işlemi
      if (ikinciSayi === 0) {
        throw new Error('Sıfıra bölünemez');
      }
      sonuc = ilkSayi / ikinciSayi;
    } 
    else {
      throw new Error('Bilinmeyen operatör');
    }

    // Sonucu yuvarlama (çok uzun ondalık sayılar olmasını önlemek için)
    sonuc = parseFloat(sonuc.toFixed(8));
    
    return sonuc;
  }
} 