export type ChequeField = 'check-no' | 'check-suppliername' | 'check-amount' | 'check-amount-words' | 'check-micr' | 'check-date' | 'check-signature' | 'check_debitor' | 'check-crossing';

export interface ChequeBox {
  label: ChequeField;
  xtl: number;
  ytl: number;
  xbr: number;
  ybr: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  textColor?: string;
}

export interface ChequeConfig {
  id: string;                    // Unique identifier for the cheque template
  bankId: string;               // Bank identifier
  modelId: string;              // Model identifier
  bankName: string;             // Display name of the bank
  modelName: string;            // Display name of the model
  imageUrl: string;             // S3 URL for the cheque template image
  printWidth: number;           // Width in mm
  printHeight: number;          // Height in mm
  defaultFontSize: number;      // Default font size
  defaultFontFamily: string;    // Default font family
  defaultFontWeight: number;    // Default font weight
  defaultTextColor: string;     // Default text color
  boxes: ChequeBox[];           // Array of field boxes
  createdAt: string;            // ISO timestamp of creation
  updatedAt: string;            // ISO timestamp of last update
  isActive: boolean;            // Whether this template is active
}

// Example of how the data would look
export const exampleChequeConfig: ChequeConfig = {
  id: "cib-standard-001",
  bankId: "cib",
  modelId: "standard",
  bankName: "CIB",
  modelName: "Standard",
  imageUrl: "https://s3.amazonaws.com/cheque-templates/cib/standard.jpg",
  printWidth: 168,
  printHeight: 82,
  defaultFontSize: 16,
  defaultFontFamily: "San Serif",
  defaultFontWeight: 500,
  defaultTextColor: "#000000",
  boxes: [
    {
      label: "check-no",
      xtl: 920.51,
      ytl: 82.75,
      xbr: 1220.63,
      ybr: 135.42
    },
    {
      label: "check-suppliername",
      xtl: 280.13,
      ytl: 146.29,
      xbr: 908.8,
      ybr: 205.64
    },
    {
      label: "check-amount",
      xtl: 959.8,
      ytl: 246.61,
      xbr: 1210.6,
      ybr: 300.11
    },
    {
      label: "check-micr",
      xtl: 46.89,
      ytl: 522.49,
      xbr: 1080.18,
      ybr: 595.22
    },
    {
      label: "check-date",
      xtl: 102.06,
      ytl: 57.67,
      xbr: 277.62,
      ybr: 121.21
    },
    {
      label: "check_debitor",
      xtl: 58.59,
      ytl: 366.16,
      xbr: 714.85,
      ybr: 418.82
    },
    {
      label: "check-signature",
      xtl: 819.35,
      ytl: 424.68,
      xbr: 1131.18,
      ybr: 503.26
    },
    {
      label: "check-amount-words",
      xtl: 280.13,
      ytl: 246.61,
      xbr: 708.8,
      ybr: 350
    },
    {
      label: "check-crossing",
      xtl: 832,
      ytl: 57.67,
      xbr: 277.62,
      ybr: 121.21
    }
  ],
  createdAt: "2024-03-20T10:00:00Z",
  updatedAt: "2024-03-20T10:00:00Z",
  isActive: true
}; 