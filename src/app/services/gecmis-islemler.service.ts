import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Geçmiş işlemlerin tutulacağı model
 */
export interface IslemGecmisi {
  ilkSayi: number;
  ikinciSayi: number;
  operator: string;
  sonuc: number;
  tarih: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GecmisIslemlerService {
  // Geçmiş işlemleri tutan BehaviorSubject
  private islemGecmisiListesi = new BehaviorSubject<IslemGecmisi[]>([]);
  
  // Maksimum geçmiş işlem sayısı
  private readonly MAKS_GECMIS_SAYISI = 5;

  constructor() {}

  /**
   * Yeni bir işlemi geçmişe ekler
   * @param islem Eklenecek işlem bilgisi
   */
  islemEkle(islem: IslemGecmisi): void {
    const mevcutListe = this.islemGecmisiListesi.getValue();
    
    // Yeni işlemi listenin başına ekle
    let yeniListe = [islem, ...mevcutListe];
    
    // Eğer liste maksimum sayıdan fazla olursa, en eski işlemleri kaldır
    if (yeniListe.length > this.MAKS_GECMIS_SAYISI) {
      yeniListe = yeniListe.slice(0, this.MAKS_GECMIS_SAYISI);
    }
    
    // Güncellenmiş listeyi yayınla
    this.islemGecmisiListesi.next(yeniListe);
  }

  /**
   * Geçmiş işlemleri temizler
   */
  gecmisiTemizle(): void {
    this.islemGecmisiListesi.next([]);
  }

  /**
   * Geçmiş işlemler listesini gözlemlemek için Observable döndürür
   * @returns Geçmiş işlemler listesini içeren Observable
   */
  islemGecmisiniGetir(): Observable<IslemGecmisi[]> {
    return this.islemGecmisiListesi.asObservable();
  }
} 