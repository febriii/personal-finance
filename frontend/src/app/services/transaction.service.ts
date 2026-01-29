import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  amount: string;
  type: string;
  date: string;
  description: string;
  category: number;
}

@Injectable({ providedIn: 'root' })

export class TransactionService {
  apiUrl = 'http://localhost:5000/transactions/';

  constructor(private http: HttpClient) {}

  addTransaction(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getCategories() {
    return this.http.get<any[]>('http://localhost:5000/categories/');
  }
  
  getTransactions() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSummary() {
    return this.http.get<any>(`${this.apiUrl}summary`);
  }

  getMonthlySummary() {
    return this.http.get<any>(`${this.apiUrl}summary/monthly`);
  }

  getCategorySummary() {
    return this.http.get<any[]>(`${this.apiUrl}summary/category`);
  }
}
