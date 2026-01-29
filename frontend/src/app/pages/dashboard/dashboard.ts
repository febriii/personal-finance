import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HealthService } from '../../services/health.service';
import { TransactionService } from '../../services/transaction.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
  newTransaction = {
    amount: 0,
    type: 'expense',
    date: '',
    description: '',
    category_id: 1
  };
  modals = {
    addTransaction: false
  }

  transactionData: any[] = [];
  categoryData: any[] = [];
  monthlyData: any[] = [];
  categories: any[] = [];

  monthlyChartID: any;
  categoryChartID: any;
  expenseChartID: any;

  ngOnInit(): void {
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
  
    this.loadCategories();
    this.loadTransactionData();
    this.loadMonthlyData();
    this.loadCategorySummaryData();
  }

  submitTransaction() {
    this.transactionService.addTransaction(this.newTransaction).subscribe({
      next: () => {
        alert('Transaction added!');
        
        this.newTransaction = {
          amount: 0,
          type: 'expense',
          date: '',
          description: '',
          category_id: 1
        };
        
        this.loadTransactionData();
        this.toggleModal('addTransaction', false);
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error('error submitting transaction data', err);
        }
      }
    });
  }

  loadTransactionData() {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactionData = data;
        this.renderTransactionBarChart();
      },
      error: err => {
        if (err.status !== 401) {
          console.error('error load transactions', err);
        }
      }
    });
  }

  loadMonthlyData() {
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

  loadCategorySummaryData() {
    this.transactionService.getCategorySummary().subscribe({
      next: (data) => {
        this.categoryData = data;
        this.renderCategorySummaryPieChart();
      },
      error: (err) => {
        if (err.status !== 401) {
          console.error('error load category summary', err);
        }
      }
    });
  }

  renderTransactionBarChart() {
    const labels: string[] = [];
    const data: number[] = [];

    const map = new Map<string, number>();

    for (const tx of this.transactionData) {
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

    if (this.expenseChartID) {
      this.expenseChartID.destroy();
    }

    this.expenseChartID = new Chart('expenseChartID', {
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

    if (this.monthlyChartID) {
      this.monthlyChartID.destroy();
    }
    
    this.monthlyChartID = new Chart('monthlyChartID', {
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

  renderCategorySummaryPieChart() {
    const labels = this.categoryData.map(d => d.category);
    const values = this.categoryData.map(d => d.total);

    if (this.categoryChartID) {
      this.categoryChartID.destroy();
    }
    
    this.categoryChartID = new Chart('categoryChartID', {
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

  loadCategories() {
    this.transactionService.getCategories().subscribe({
    next: (data) => {
      this.categories = data;
    },
    error: (err) => {
        if (err.status !== 401) {
          console.error('error load categories', err);
        }
      }
  });
  }

  toggleModal(key: keyof typeof this.modals, isOpen: boolean) {
    this.modals[key] = isOpen;
  }
}
