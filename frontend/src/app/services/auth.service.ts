import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:5000/auth';
  private accessKey = 'token';
  private refreshKey = 'refresh_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.api}/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem(this.accessKey, res.access_token);
        localStorage.setItem(this.refreshKey, res.refresh_token);
      }));
  }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  getToken() {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.accessKey, token);
  }

  logout() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    this.router.navigate([ '/login' ]);
  }
}
