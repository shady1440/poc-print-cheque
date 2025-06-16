import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ChequeBox, ChequeConfig, ChequeDataService, ChequeDetails, ChequeField } from './cheque-data.service';

@Component({
  selector: 'app-cheque-annotation',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, NgStyle],
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
  readonly IMAGE_WIDTH = 1300;
  readonly IMAGE_HEIGHT = 624;

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
    'check-no': 17,
    'check-suppliername': 17,
    'check-amount': 17,
    'check-amount-words': 17,
    'check-micr': 17,
    'check-date': 17,
    'check-signature': 17,
    'check_debitor': 17,
    'check-crossing': 32
  };

  // Calibration constant for A4 font size (mm per px)
  readonly A4_FONT_MM_PER_PX = 0.10; // Start with 0.18, tweak as needed

  constructor(
    private chequeDataService: ChequeDataService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      bank: ['AAIB'],
      model: ['Standard'],
      debug: [false]
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

    // If debug, add cheque image back (faded) and show annotation box borders/labels
    const debug = this.form.get('debug')?.value;
    if (debug && this.printOnA4 && chequeContainer) {
      // Add faded cheque image as background
      const chequeImage = document.createElement('img');
      chequeImage.src = this.chequeConfig.imageUrl;
      chequeImage.style.position = 'absolute';
      chequeImage.style.left = '0';
      chequeImage.style.top = '0';
      chequeImage.style.width = '100%';
      chequeImage.style.height = '100%';
      chequeImage.style.opacity = '0.2';
      chequeImage.style.pointerEvents = 'none';
      chequeImage.className = 'cheque-debug-image';
      chequeContainer.insertBefore(chequeImage, chequeContainer.firstChild);

      // Add field label to each annotation box
      const annotationBoxes = chequeContainer.querySelectorAll('.annotation-box');
      annotationBoxes.forEach(box => {
        const label = document.createElement('div');
        label.textContent = box.getAttribute('data-label') || '';
        label.style.position = 'absolute';
        label.style.top = '0';
        label.style.left = '0';
        label.style.fontSize = '10px';
        label.style.background = 'rgba(255,255,0,0.5)';
        label.style.color = '#000';
        label.style.zIndex = '10';
        box.appendChild(label);
      });
    }

    // Calculate scale factor to match physical cheque size
    const scaleFactor = (this.chequeConfig.printWidth * this.MM_TO_PX) / this.IMAGE_WIDTH;

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
          border: ${debug ? '2px solid red !important' : 'none'};
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .cheque-bottom-align {
          position: absolute;
          left: 50%;
          bottom: 5mm; /* Add some margin from bottom */
          transform: translateX(-50%);
          border: ${debug ? '2px solid green !important' : 'none'};
        }
        .cheque-container {
          width: ${this.chequeConfig.printWidth}mm !important;
          height: ${this.chequeConfig.printHeight}mm !important;
          position: relative;
          transform: none !important;
          border: ${debug ? '2px solid blue !important' : 'none'};
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
          width: 210mm;
          height: 297mm;
          overflow: hidden;
          box-sizing: border-box;
        }
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
        }
      `;
    } else {
      // Custom cheque size, use scaling
      chequeStyles = `
        @media print {
          @page {
            size: ${this.chequeConfig.printWidth}mm ${this.chequeConfig.printHeight}mm;
            margin: 0;
          }
          html, body {
            width: ${this.chequeConfig.printWidth}mm;
            height: ${this.chequeConfig.printHeight}mm;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden;
            border: ${debug ? '2px solid red !important' : 'none'};
          }
          .cheque-container {
            width: ${this.chequeConfig.printWidth}mm !important;
            height: ${this.chequeConfig.printHeight}mm !important;
            position: relative;
            transform-origin: top left;
            transform: scale(${scaleFactor});
            margin: 0;
            padding: 0;
            border: none;
          }
        }
      `;
    }

    // Common styles
    chequeStyles += `
      .annotation-box {
        position: absolute;
        border: ${debug ? '1px dashed orange' : 'none'};
        box-sizing: border-box;
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
      .print-button, .label {
        display: none !important;
      }
      .cheque-image {
        display: ${debug ? 'block' : 'none'} !important;
      }
      .cheque-debug-image {
        display: block !important;
        opacity: 0.2 !important;
        pointer-events: none;
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

  /**
   * Returns the style object for an annotation box, using mm for A4 mode and px otherwise.
   */
  getBoxStyle(box: ChequeBox): {[key: string]: string} {
    if (this.printOnA4) {
      // Calculate mm per px for both axes
      const mmPerPxX = this.chequeConfig.printWidth / this.IMAGE_WIDTH;
      const mmPerPxY = this.chequeConfig.printHeight / this.IMAGE_HEIGHT;
      // Convert px to mm for font size using calibration constant
      const fontSizePx = this.getFontSize(box.Label);
      const fontSizeMm = fontSizePx * this.A4_FONT_MM_PER_PX;
      return {
        left: `${box.xtl * mmPerPxX}mm`,
        top: `${box.ytl * mmPerPxY}mm`,
        width: `${(box.xbr - box.xtl) * mmPerPxX}mm`,
        height: `${(box.ybr - box.ytl) * mmPerPxY}mm`,
        'font-family': String(box.FontFamily || this.chequeConfig.defaultFontFamily),
        'font-size': `${fontSizeMm}mm`,
        'font-weight': String(box.FontWeight || this.chequeConfig.defaultFontWeight),
        color: String(box.TextColor || this.chequeConfig.defaultTextColor),
        position: 'absolute',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'text-align': 'center',
      };
    } else {
      return {
        left: `${box.xtl}px`,
        top: `${box.ytl}px`,
        width: `${box.xbr - box.xtl}px`,
        height: `${box.ybr - box.ytl}px`,
        'font-family': String(box.FontFamily || this.chequeConfig.defaultFontFamily),
        'font-size': `${this.getFontSize(box.Label)}px`,
        'font-weight': String(box.FontWeight || this.chequeConfig.defaultFontWeight),
        color: String(box.TextColor || this.chequeConfig.defaultTextColor),
        position: 'absolute',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'text-align': 'center',
      };
    }
  }
}
