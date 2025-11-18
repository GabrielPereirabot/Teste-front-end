// ARQUIVO: src/app/pages/login/login.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  password: string = ''; // Changed from 'senha' to 'password'
  loading: boolean = false;
  error: string = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.error = 'Email ou senha inválidos';
          this.loading = false;
        }
      });
  }
}
