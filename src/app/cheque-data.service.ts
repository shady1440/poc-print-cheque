import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type ChequeField = 'check-no' | 'check-suppliername' | 'check-amount' | 'check-amount-words' | 'check-micr' | 'check-date' | 'check-signature' | 'check_debitor' | 'check-crossing';

export interface ChequeBox {
  Label: ChequeField;
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
  bankName: string;
  modelName: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  printWidth: number;  // in mm
  printHeight: number; // in mm
  boxes: ChequeBox[];
  defaultFontSize: number;
  defaultFontFamily: string;
  defaultFontWeight: number;
  defaultTextColor: string;
}

export interface ChequeDetails {
  [key: string]: string | boolean;
}

@Injectable({ providedIn: 'root' })
export class ChequeDataService {
  private readonly chequeTemplates: Record<string, ChequeConfig> = {
    'AAIB-Standard': {
      bankName: 'AAIB',
      modelName: 'Standard',
      imageUrl: 'assets/aaib.jpg',
      imageWidth: 1300,
      imageHeight: 624,
      printWidth: 175,  // Standard cheque width in mm
      printHeight: 75,  // Standard cheque height in mm
      defaultFontSize: 16,
      defaultFontFamily: 'San Serif',
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
          Label: 'check-amount-words',
          xtl: 235.39,
          ytl: 225.245,
          xbr: 1014.04,
          ybr: 270.9
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
        },
        {
          Label: 'check-crossing',
          xtl: 889.0,
          ytl: 19.25,
          xbr: 980,
          ybr: 72.4
        }
      ]
    },
    'CIB-Standard': {
      bankName: 'CIB',
      modelName: 'Standard',
      imageUrl: 'assets/cib.jpg',
      imageWidth: 1300,
      imageHeight: 624,
      printWidth: 175,  // Standard cheque width in mm
      printHeight: 75,  // Standard cheque height in mm
      defaultFontSize: 16,
      defaultFontFamily: 'San Serif',
      defaultFontWeight: 500,
      defaultTextColor: '#000000',
      boxes: [
        {
          Label: 'check-no',
          xtl: 920.51,
          ytl: 82.75,
          xbr: 1220.63,
          ybr: 135.42
        },
        {
          Label: 'check-suppliername',
          xtl: 280.13,
          ytl: 146.29,
          xbr: 908.8,
          ybr: 205.64
        },
        {
          Label: 'check-amount',
          xtl: 959.8,
          ytl: 246.61,
          xbr: 1210.6,
          ybr: 300.11
        },
        {
          Label: 'check-micr',
          xtl: 46.89,
          ytl: 522.49,
          xbr: 1080.18,
          ybr: 595.22
        },
        {
          Label: 'check-date',
          xtl: 102.06,
          ytl: 57.67,
          xbr: 277.62,
          ybr: 121.21
        },
        {
          Label: 'check_debitor',
          xtl: 58.59,
          ytl: 366.16,
          xbr: 714.85,
          ybr: 418.82
        },
        {
          Label: 'check-signature',
          xtl: 819.35,
          ytl: 424.68,
          xbr: 1131.18,
          ybr: 503.26
        }
      ]
    }
  };

  getChequeConfig(bankName: string, modelName: string): Observable<ChequeConfig> {
    const templateKey = `${bankName}-${modelName}`;
    const template = this.chequeTemplates[templateKey];
    
    if (!template) {
      throw new Error(`No template found for ${bankName} ${modelName}`);
    }
    
    return of(template);
  }

  getAvailableTemplates(): Observable<Array<{bankName: string, modelName: string}>> {
    const templates = Object.keys(this.chequeTemplates).map(key => {
      const [bankName, modelName] = key.split('-');
      return { bankName, modelName };
    });
    return of(templates);
  }

  getChequeDetails(): Observable<ChequeDetails> {
    return of({
      'check-no': '',
      'check-suppliername': 'سيتل للمدفوعات',
      'check-amount': '1,234,567.89',
      'check-amount-words': 'مليون ومئتان وثلاثة وأربعين ألف وخمسمئة وسبعة وستين وثمانية وتسعين',
      'check-micr': '',
      'check-date': '2025-06-01',
      'check-signature': '',
      'check_debitor': '',
      'check-crossing': true,
    });
  }
} 