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

  getTransactions() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
