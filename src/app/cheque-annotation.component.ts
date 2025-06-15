import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ChequeBox, ChequeConfig, ChequeDataService, ChequeDetails, ChequeField } from './cheque-data.service';

@Component({
  selector: 'app-cheque-annotation',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './cheque-annotation.component.html',
  styleUrl: './cheque-annotation.component.scss'
})
export class ChequeAnnotationComponent implements OnInit {
  @Input() chequeConfig!: ChequeConfig;
  @Input() chequeDetails!: ChequeDetails;
  boxes: ChequeBox[] = [];
  readonly MM_TO_PX = 3.7795275591; // 1mm = 3.7795275591px at 96 DPI
  printOnA4 = false;
  availableTemplates$ = new BehaviorSubject<Array<{bankName: string, modelName: string}>>([]);
  form: FormGroup;

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

  constructor(
    private chequeDataService: ChequeDataService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      bank: ['AAIB'],
      model: ['Standard']
    });
  }

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

    // Load available templates
    this.loadTemplates();

    // Subscribe to form changes
    this.form.valueChanges.subscribe(values => {
      this.loadChequeConfig();
    });
  }

  loadTemplates() {
    this.chequeDataService.getAvailableTemplates().subscribe(templates => {
      this.availableTemplates$.next(templates);
      if (templates.length > 0) {
        this.form.patchValue({
          bank: templates[0].bankName,
          model: templates[0].modelName
        });
      }
    });
  }

  loadChequeConfig() {
    const { bank, model } = this.form.value;
    this.chequeDataService.getChequeConfig(bank, model).subscribe(config => {
      this.chequeConfig = config;
      this.boxes = config.boxes;
    });
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

    let chequeHtml = chequeContainer.outerHTML;
    let chequeStyles = '';

    if (this.printOnA4) {
      // On A4, render cheque at real size (in mm), bottom-aligned, no scaling
      chequeHtml = `<div class='a4-print-area'><div class='cheque-bottom-align'>${chequeHtml}</div></div>`;
      chequeStyles = `
        .a4-print-area {
          position: relative;
          width: 210mm;
          height: 297mm;
          border: 2px solid red !important;
        }
        .cheque-bottom-align {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        }
        .cheque-container {
          width: ${this.chequeConfig.printWidth}mm !important;
          height: ${this.chequeConfig.printHeight}mm !important;
          position: relative;
          transform: none !important;
          border: 2px solid blue !important;
        }
        body, html {
          margin: 0;
          padding: 0;
          width: 210mm;
          height: 297mm;
          overflow: hidden;
        }
      `;
    } else {
      // Custom cheque size, use scaling
      chequeStyles = `
        .cheque-container {
          width: ${this.chequeConfig.printWidth}mm !important;
          height: ${this.chequeConfig.printHeight}mm !important;
          position: relative;
          transform-origin: top left;
          transform: scale(${scaleFactor});
        }
        body {
          margin: 0;
          padding: 0;
          width: ${this.chequeConfig.printWidth}mm;
          height: ${this.chequeConfig.printHeight}mm;
          overflow: hidden;
        }
      `;
    }

    // Common styles
    chequeStyles += `
      @page {
        size: ${this.printOnA4 ? 'A4' : `${this.chequeConfig.printWidth}mm ${this.chequeConfig.printHeight}mm`};
        margin: 0;
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
      .print-button, .label, .cheque-image {
        display: none !important;
      }
    `;

    // Create the print document
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Cheque - ${this.chequeConfig.bankName} ${this.chequeConfig.modelName}</title>
          <style>${chequeStyles}</style>
        </head>
        <body>
          ${chequeHtml}
          <script>
            window.onload = function() {
              window.print();
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
