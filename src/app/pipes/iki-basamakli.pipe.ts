import { Pipe, PipeTransform } from '@angular/core';

/**
 * Sayıyı iki basamaklı formata dönüştürür. 
 * Tek basamaklı sayıların başına 0 ekler. (örn: 5 -> 05)
 * @example {{ 5 | ikiBasamakli }} -> 05
 * @example {{ 10 | ikiBasamakli }} -> 10
 */
@Pipe({
  name: 'ikiBasamakli',
  standalone: true
})
export class IkiBasamakliPipe implements PipeTransform {
  /**
   * Verilen sayısal değeri iki basamaklı formata dönüştürür.
   * @param deger Dönüştürülecek değer
   * @returns İki basamaklı formata dönüştürülmüş değer (string)
   */
  transform(deger: number | string | null): string {
    // Null değer kontrolü
    if (deger === null) {
      return '0';
    }
    
    // String olmayan değerleri string'e dönüştür
    const stringDeger = String(deger);
    
    // Sayıyı parse et
    const sayi = parseInt(stringDeger, 10);
    
    // Geçerli bir sayı değilse, orijinal değeri döndür
    if (isNaN(sayi)) {
      return stringDeger;
    }
    
    // Tek basamaklı pozitif sayıların başına 0 ekle
    if (sayi >= 0 && sayi < 10) {
      return `0${sayi}`;
    }
    
    // Diğer durumlarda sayıyı döndür
    return String(sayi);
  }
} 