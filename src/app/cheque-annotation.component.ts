import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChequeBox, ChequeConfig, ChequeDetails } from './cheque-data.service';

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

  ngOnInit() {
    if (!this.chequeConfig) return;
    this.boxes = this.chequeConfig.boxes;
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

    // Calculate scale factor to match standard cheque size
    const scaleFactor = (this.chequeConfig.printWidth * this.MM_TO_PX) / this.chequeConfig.width;

    // Create print-specific styles
    const styles = `
      <style>
        @page {
          size: ${this.chequeConfig.printWidth}mm ${this.chequeConfig.printHeight}mm;
          margin: 0;
        }

        body {
          margin: 0;
          padding: 0;
          width: ${this.chequeConfig.printWidth}mm;
          height: ${this.chequeConfig.printHeight}mm;
          overflow: hidden;
        }

        .cheque-container {
          width: ${this.chequeConfig.printWidth}mm !important;
          height: ${this.chequeConfig.printHeight}mm !important;
          position: relative;
          transform-origin: top left;
          transform: scale(${scaleFactor});
        }

        .annotation-box {
          position: absolute;
          border: none;
        }

        .cheque-value {
          background: none;
          color: ${this.chequeConfig.defaultTextColor};
          font-size: ${this.chequeConfig.defaultFontSize}px;
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
      </style>
    `;

    // Create the print document
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Cheque</title>
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
