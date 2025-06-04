import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ChequeBox {
  Label: string;
  xtl: number;
  ytl: number;
  xbr: number;
  ybr: number;
  FontFamily?: string;
  FontSize?: number;
  FontWeight?: number;
  TextColor?: string;
}

export interface ChequeConfig {
  imageId: string;
  imageName: string;
  width: number;
  height: number;
  printWidth: number;  // in mm
  printHeight: number; // in mm
  boxes: ChequeBox[];
  defaultFontSize: number;
  defaultFontFamily: string;
  defaultFontWeight: number;
  defaultTextColor: string;
}

export interface ChequeDetails {
  [key: string]: string;
}

@Injectable({ providedIn: 'root' })
export class ChequeDataService {
  getChequeConfig(): Observable<ChequeConfig> {
    return of({
      imageId: 'aaib',
      imageName: 'aaib.jpg',
      width: 1300,
      height: 624,
      printWidth: 175,  // Standard cheque width in mm
      printHeight: 75,  // Standard cheque height in mm
      defaultFontSize: 16,
      defaultFontFamily: 'Arial',
      defaultFontWeight: 500,
      defaultTextColor: '#000000',
      boxes: [
        {
          Label: 'check-no',
          xtl: 151.87,
          ytl: 43.72,
          xbr: 342.52,
          ybr: 76.62
        },
        {
          Label: 'check-suppliername',
          xtl: 235.39,
          ytl: 158.45,
          xbr: 1014.04,
          ybr: 204.0
        },
        {
          Label: 'check-amount',
          xtl: 882.4,
          ytl: 305.2,
          xbr: 1181.1,
          ybr: 360.9
        },
        {
          Label: 'check-micr',
          xtl: 59.92,
          ytl: 522.89,
          xbr: 1035.97,
          ybr: 587.85
        },
        {
          Label: 'check-date',
          xtl: 1036.0,
          ytl: 19.25,
          xbr: 1201.32,
          ybr: 72.4
        },
        {
          Label: 'check-signature',
          xtl: 140.06,
          ytl: 351.63,
          xbr: 584.64,
          ybr: 415.75
        },
        {
          Label: 'check_debitor',
          xtl: 1093.34,
          ytl: 370.19,
          xbr: 1265.43,
          ybr: 417.4
        }
      ]
    });
  }

  getChequeDetails(): Observable<ChequeDetails> {
    return of({
      'check-no': '123456',
      'check-suppliername': 'Supplier Name',
      'check-amount': '1,000.00 EGP',
      'check-micr': '12345678901234567890',
      'check-date': '2024-06-01',
      'check-signature': 'Signature',
      'check_debitor': 'Debitor Name'
    });
  }
} 