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

  summary = {
    total_income: 0,
    total_expense: 0,
    balance: 0
  };

  categoryData: any[] = [];
  monthlyData: any[] = [];

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      next: transactions => {
        // console.log('Trans:', transactions);
        this.renderChart(transactions);
      },
      error: err => {
        if (err.status !== 401) {
          console.error('error load transactions', err);
        }
      }
    });

    this.transactionService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error('error load daily summary', err);
        }
      }
    });
  
    this.loadMonthlyBarChart();
    this.loadCategorySummaryPieChart();
  }

  loadMonthlyBarChart() {
    this.transactionService.getMonthlySummary().subscribe({
      next: (data) => {
        this.monthlyData = data;
        this.renderMonthlyChart();
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error('error load monthly summary', err);
        }
      }
    });
  }

  loadCategorySummaryPieChart() {
    this.transactionService.getCategorySummary().subscribe({
      next: (data) => {
        this.categoryData = data;
        this.renderCategoryChart();
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error('error load category summary', err);
        }
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

  renderMonthlyChart() {
    const labels = this.monthlyData.map(d => d.month);
    const incomeData = this.monthlyData.map(d => d.income);
    const expenseData = this.monthlyData.map(d => d.expense);

    new Chart('monthlyChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData
          },
          {
            label: 'Expense',
            data: expenseData
          }
        ]
      }
    });
  }

  renderCategoryChart() {
    const labels = this.categoryData.map(d => d.category);
    const values = this.categoryData.map(d => d.total);

    new Chart('categoryChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values
          }
        ]
      }
    });
  }
}
