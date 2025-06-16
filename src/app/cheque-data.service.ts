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
      printWidth: 172,  // Standard cheque width in mm
      printHeight: 82,  // Standard cheque height in mm
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
      printWidth: 168,
      printHeight: 82,  
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
        },
        {
          Label: 'check-amount-words',
          xtl: 280.13,
          ytl: 246.61,
          xbr: 708.8,
          ybr: 350
        },
        {
          Label: 'check-crossing',
          xtl: 832,
          ytl: 57.67,
          xbr: 277.62,
          ybr: 121.21
        }
      ]
    },
    'ADIB-Standard': {
      bankName: 'ADIB',
      modelName: 'Standard',
      imageUrl: 'assets/adib.jpg',
      imageWidth: 1300,
      imageHeight: 624,
      printWidth: 165,
      printHeight: 82,
      defaultFontSize: 16,
      defaultFontFamily: 'San Serif',
      defaultFontWeight: 500,
      defaultTextColor: '#000000',
      boxes: [
        {
          Label: 'check-no',
          xtl: 155.87,
          ytl: 55.54,
          xbr: 381.5,
          ybr: 123.91
        },
        {
          Label: 'check-suppliername',
          xtl: 365.27,
          ytl: 138.44,
          xbr: 949.0,
          ybr: 217.92
        },
        {
          Label: 'check-amount',
          xtl: 869.52,
          ytl: 257.24,
          xbr: 1232.75,
          ybr: 325.61
        },
        {
          Label: 'check-amount-words',
          xtl: 205.27,
          ytl: 227.24,
          xbr: 769.52,
          ybr: 325.61
        },
        {
          Label: 'check-micr',
          xtl: 61.0,
          ytl: 517.91,
          xbr: 1091.73,
          ybr: 614.49
        },
        {
          Label: 'check-date',
          xtl: 931.06,
          ytl: 72.63,
          xbr: 1184.0,
          ybr: 136.73
        },
        {
          Label: 'check_debitor',
          xtl: 47.3,
          ytl: 321.3,
          xbr: 449.0,
          ybr: 367.49
        },
        {
          Label: 'check-signature',
          xtl: 619.96,
          ytl: 430.73,
          xbr: 1177.2,
          ybr: 485.43
        },
        {
          Label: 'check-crossing',
          xtl: 831.06,
          ytl: 62.63,
          xbr: 884.0,
          ybr: 126.73
        }
      ]
    },
    'FAB-Standard': {
      bankName: 'FAB',
      modelName: 'Standard',
      imageUrl: 'assets/fab.jpg',
      imageWidth: 1300,
      imageHeight: 624,
      printWidth: 170,
      printHeight: 83,
      defaultFontSize: 16,
      defaultFontFamily: 'San Serif',
      defaultFontWeight: 500,
      defaultTextColor: '#000000',
      boxes: [
        {
          Label: 'check-no',
          xtl: 552.37,
          ytl: 69.11,
          xbr: 700.22,
          ybr: 126.42
        },
        {
          Label: 'check-suppliername',
          xtl: 210.15,
          ytl: 185.4,
          xbr: 1117.2,
          ybr: 234.41
        },
        {
          Label: 'check-amount',
          xtl: 932.8,
          ytl: 71.6,
          xbr: 1243.46,
          ybr: 137.22
        },
        {
          Label: 'check-amount-words',
          xtl: 210.15,
          ytl: 251.6,
          xbr: 1017.2,
          ybr: 237.22
        },
        {
          Label: 'check-micr',
          xtl: 119.61,
          ytl: 499.38,
          xbr: 1002.57,
          ybr: 584.1
        },
        {
          Label: 'check-date',
          xtl: 481.77,
          ytl: 311.7,
          xbr: 690.26,
          ybr: 354.0
        },
        {
          Label: 'check_debitor',
          xtl: 274.11,
          ytl: 419.64,
          xbr: 669.49,
          ybr: 467.81
        },
        {
          Label: 'check-signature',
          xtl: 814.02,
          ytl: 375.61,
          xbr: 1137.96,
          ybr: 453.69
        },
        {
          Label: 'check-crossing',
          xtl: 732.8,
          ytl: 71.6,
          xbr: 800.46,
          ybr: 137.22
        }
      ]
    },
    'QNB-Standard': {
      bankName: 'QNB',
      modelName: 'Standard',
      imageUrl: 'assets/qnb.jpg',
      imageWidth: 1300,
      imageHeight: 624,
      printWidth: 168,
      printHeight: 83,
      defaultFontSize: 16,
      defaultFontFamily: 'San Serif',
      defaultFontWeight: 500,
      defaultTextColor: '#000000',
      boxes: [
        {
          Label: 'check-no',
          xtl: 986.79,
          ytl: 42.78,
          xbr: 1178.67,
          ybr: 95.94
        },
        {
          Label: 'check-suppliername',
          xtl: 280.76,
          ytl: 187.31,
          xbr: 1110.55,
          ybr: 251.27
        },
        {
          Label: 'check-amount',
          xtl: 1026.66,
          ytl: 265.4,
          xbr: 1242.6,
          ybr: 352.61
        },
        {
          Label: 'check-micr',
          xtl: 62.3,
          ytl: 537.0,
          xbr: 1019.19,
          ybr: 600.1
        },
        {
          Label: 'check-date',
          xtl: 879.64,
          ytl: 98.43,
          xbr: 1171.19,
          ybr: 161.56
        },
        {
          Label: 'check_debitor',
          xtl: 56.49,
          ytl: 394.97,
          xbr: 427.78,
          ybr: 423.21
        },
        {
          Label: 'check-signature',
          xtl: 650.39,
          ytl: 443.14,
          xbr: 1204.42,
          ybr: 512.09
        }
      ]
    },
    'BDC-Standard': {
      bankName: 'BDC',
      modelName: 'Standard',
      imageUrl: 'assets/bdc.jpg',
      imageWidth: 1300,
      imageHeight: 624,
      printWidth: 168,
      printHeight: 82,
      defaultFontSize: 16,
      defaultFontFamily: 'San Serif',
      defaultFontWeight: 500,
      defaultTextColor: '#000000',
      boxes: [
        {
          Label: 'check-no',
          xtl: 493.4,
          ytl: 84.15,
          xbr: 741.75,
          ybr: 126.51
        },
        {
          Label: 'check-suppliername',
          xtl: 273.28,
          ytl: 172.19,
          xbr: 947.75,
          ybr: 239.47
        },
        {
          Label: 'check-amount',
          xtl: 980.1,
          ytl: 288.48,
          xbr: 1228.5,
          ybr: 350.74
        },
        {
          Label: 'check-micr',
          xtl: 48.18,
          ytl: 490.32,
          xbr: 1208.57,
          ybr: 565.08
        },
        {
          Label: 'check-date',
          xtl: 943.6,
          ytl: 124.02,
          xbr: 1162.88,
          ybr: 168.87
        },
        {
          Label: 'check_debitor',
          xtl: 3.33,
          ytl: 392.31,
          xbr: 321.46,
          ybr: 424.7
        },
        {
          Label: 'check-signature',
          xtl: 921.17,
          ytl: 371.54,
          xbr: 1222.69,
          ybr: 418.06
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