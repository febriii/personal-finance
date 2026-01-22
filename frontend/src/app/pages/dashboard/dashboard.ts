import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HealthService } from '../../services/health.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})

export class DashboardComponent implements OnInit {

  constructor(
    private healthService: HealthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      next: transactions => {
        console.log('Trans:', transactions);
        this.renderChart(transactions);
      },
      error: err => {
        console.error('error load transactions', err);
      }
    });
  }

  renderChart(transactions: any[]) {
    const labels: string[] = [];
    const data: number[] = [];

    const map = new Map<string, number>();

    for (const tx of transactions) {
      if (tx.type === 'expense') {
        const date = tx.date;
        const amount = parseFloat(tx.amount);

        map.set(date, (map.get(date) || 0) + amount);
      }
    }

    for (const [date, total] of map.entries()) {
      labels.push(date);
      data.push(total);
    }

    new Chart('expenseChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Daily Expenses',
          data
        }]
      }
    });
  }
}
