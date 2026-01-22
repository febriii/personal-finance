import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
	) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        // token is now in localStorage
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Invalid email or password';
      }
    });
  }
}
