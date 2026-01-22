import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HealthService } from '../../services/health.service';
import { TransactionService, Transaction } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})

export class DashboardComponent implements OnInit {
  backendMessage = 'Checking backend...';
  transactions: Transaction[] = [];

  constructor(
    private healthService: HealthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    this.healthService.checkHealth().subscribe({
      next: (res) => {
        this.backendMessage = res.message;
      },
      error: (err) => {
        console.error(err);
        this.backendMessage = 'Backend is NOT reachable';
      }
    });

    if (token) {
      console.log('hhe', token)
      this.transactionService.getTransactions(token).subscribe({
        next: data => {
          this.transactions = data;
          console.log('Trans:', data);
        },
        error: err => {
          console.error('failed:', err);
        }
      });
    } else {
      console.log('hehe goblok')
    }
  }
}
