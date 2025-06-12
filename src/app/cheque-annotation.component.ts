import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChequeBox, ChequeConfig, ChequeDetails, ChequeField } from './cheque-data.service';

@Component({
  selector: 'app-cheque-annotation',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './cheque-annotation.component.html',
  styleUrl: './cheque-annotation.component.scss'
})
export class ChequeAnnotationComponent implements OnInit {
  @Input() chequeConfig!: ChequeConfig;
  @Input() chequeDetails!: ChequeDetails;
  boxes: ChequeBox[] = [];
  readonly MM_TO_PX = 3.7795275591; // 1mm = 3.7795275591px at 96 DPI
  printOnA4 = false;

  // Font size multipliers for different fields
  fontSizeMultipliers: Record<ChequeField, number> = {
    'check-no': 1.5,
    'check-suppliername': 1.5,
    'check-amount': 1.5,
    'check-amount-words': 1.5,
    'check-micr': 1.5,
    'check-date': 1.5,
    'check-signature': 1.5,
    'check_debitor': 1.5,
    'check-crossing': 1.5
  };

  // Base font sizes for different fields
  baseFontSizes: Record<ChequeField, number> = {
    'check-no': 16,
    'check-suppliername': 16,
    'check-amount': 16,
    'check-amount-words': 16,
    'check-micr': 16,
    'check-date': 16,
    'check-signature': 16,
    'check_debitor': 16,
    'check-crossing': 32
  };

  ngOnInit() {
    if (!this.chequeConfig) return;
    this.boxes = this.chequeConfig.boxes;
    
    // Load saved font size settings from localStorage
    const savedFontSizes = localStorage.getItem('chequeFontSizes');
    if (savedFontSizes) {
      const parsed = JSON.parse(savedFontSizes);
      // Only update if the saved data matches our type
      if (this.isValidFontSizes(parsed)) {
        this.fontSizeMultipliers = parsed;
      }
    }

    // Load saved A4 printing preference
    const savedA4Printing = localStorage.getItem('printOnA4');
    if (savedA4Printing) {
      this.printOnA4 = JSON.parse(savedA4Printing);
    }
  }

  toggleCrossing(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.chequeDetails['check-crossing'] = checkbox.checked;
  }

  toggleA4Printing(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.printOnA4 = checkbox.checked;
    localStorage.setItem('printOnA4', JSON.stringify(this.printOnA4));
  }

  private isValidFontSizes(data: any): data is Record<ChequeField, number> {
    const requiredFields: ChequeField[] = [
      'check-no',
      'check-suppliername',
      'check-amount',
      'check-amount-words',
      'check-micr',
      'check-date',
      'check-signature',
      'check_debitor',
      'check-crossing'
    ];
    return requiredFields.every(field => typeof data[field] === 'number');
  }

  private isValidChequeField(label: string): label is ChequeField {
    const validFields: ChequeField[] = [
      'check-no',
      'check-suppliername',
      'check-amount',
      'check-amount-words',
      'check-micr',
      'check-date',
      'check-signature',
      'check_debitor',
      'check-crossing'
    ];
    return validFields.includes(label as ChequeField);
  }

  adjustFontSize(field: ChequeField, increment: number) {
    this.fontSizeMultipliers[field] = Math.max(0.5, Math.min(3, this.fontSizeMultipliers[field] + increment));
    localStorage.setItem('chequeFontSizes', JSON.stringify(this.fontSizeMultipliers));
  }

  getFontSize(field: ChequeField): number {
    return this.baseFontSizes[field] * this.fontSizeMultipliers[field];
  }

  formatAmount(amount: string): string {
    // Remove any existing currency symbols and whitespace
    const cleanAmount = amount.replace(/[£#\s]/g, '');
    
    // Add pound sign prefix and suffix
    return `# ${cleanAmount} #`;
  }

  getDisplayValue(field: ChequeField, value: string | boolean): string {
    if (field === 'check-amount') {
      return this.formatAmount(value as string);
    }
    if (field === 'check-crossing' && value === true) {
      return '//';
    }
    return value as string;
  }

  printCheque() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const chequeContainer = document.querySelector('.cheque-container')?.cloneNode(true) as HTMLElement;
    if (!chequeContainer) return;

    // Remove the image element
    const image = chequeContainer.querySelector('.cheque-image');
    if (image) {
      image.remove();
    }

    // Remove all labels for printing
    const labels = chequeContainer.querySelectorAll('.label');
    labels.forEach(label => label.remove());

    // Calculate scale factor to match physical cheque size
    const scaleFactor = (this.chequeConfig.printWidth * this.MM_TO_PX) / this.chequeConfig.imageWidth;

    // Create print-specific styles
    const styles = `
      <style>
        @page {
          size: ${this.printOnA4 ? 'A4' : `${this.chequeConfig.printWidth}mm ${this.chequeConfig.printHeight}mm`};
          margin: 0;
        }

        body {
          margin: 0;
          padding: 0;
          width: ${this.printOnA4 ? '210mm' : `${this.chequeConfig.printWidth}mm`};
          height: ${this.printOnA4 ? '297mm' : `${this.chequeConfig.printHeight}mm`};
          overflow: hidden;
          ${this.printOnA4 ? 'display: flex; flex-direction: column; justify-content: flex-end; align-items: center;' : ''}
        }

        .cheque-container {
          width: ${this.chequeConfig.printWidth}mm !important;
          height: ${this.chequeConfig.printHeight}mm !important;
          position: relative;
          transform-origin: top left;
          transform: scale(${scaleFactor});
          ${this.printOnA4 ? 'margin: 0 auto 0 auto;' : ''}
        }

        .annotation-box {
          position: absolute;
          border: none;
        }

        .cheque-value {
          background: none;
          color: ${this.chequeConfig.defaultTextColor};
          font-family: ${this.chequeConfig.defaultFontFamily};
          font-weight: ${this.chequeConfig.defaultFontWeight};
          padding: 0;
          position: absolute;
          white-space: nowrap;
          transform-origin: top left;
          transform: scale(1);
        }

        /* Hide print button and other UI elements */
        .print-button, .label, .cheque-image {
          display: none !important;
        }

        /* A4 specific styles */
        @media print {
          body {
            ${this.printOnA4 ? 'min-height: 297mm;' : ''}
          }
          
          .cheque-container {
            ${this.printOnA4 ? 'margin-bottom: 0 !important;' : ''}
          }
        }
      </style>
    `;

    // Create the print document
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Cheque - ${this.chequeConfig.bankName} ${this.chequeConfig.modelName}</title>
          ${styles}
        </head>
        <body>
          ${chequeContainer.outerHTML}
          <script>
            window.onload = function() {
              // Force print dialog
              window.print();
              // Close window after printing
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
}
