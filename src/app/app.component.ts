import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChequeAnnotationComponent } from './cheque-annotation.component';
import { ChequeConfig, ChequeDataService, ChequeDetails } from './cheque-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChequeAnnotationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'poc-print-cheque';
  chequeConfig: ChequeConfig | null = null;
  chequeDetails: ChequeDetails | null = null;

  constructor(private chequeDataService: ChequeDataService) {}

  ngOnInit() {
    this.chequeDataService.getChequeConfig().subscribe(config => {
      this.chequeConfig = config;
    });
    this.chequeDataService.getChequeDetails().subscribe(details => {
      this.chequeDetails = details;
    });
  }
}
