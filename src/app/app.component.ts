import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ChequeAnnotationComponent } from './cheque-annotation.component';
import { ChequeConfig, ChequeDataService, ChequeDetails } from './cheque-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChequeAnnotationComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'poc-print-cheque';
  chequeConfig$ = new BehaviorSubject<ChequeConfig | null>(null);
  chequeDetails$ = new BehaviorSubject<ChequeDetails | null>(null);

  constructor(private chequeDataService: ChequeDataService) {}

  ngOnInit() {
    this.loadChequeConfig();
    this.loadChequeDetails();
  }

  loadChequeConfig() {
    this.chequeDataService.getChequeConfig('AAIB', 'Standard').subscribe(config => {
      this.chequeConfig$.next(config);
    });
  }

  loadChequeDetails() {
    this.chequeDataService.getChequeDetails().subscribe(details => {
      this.chequeDetails$.next(details);
    });
  }
}
