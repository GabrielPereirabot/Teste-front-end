import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-visitor',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register-visita.html',
  styleUrls: ['./register-visita.css']
})
export class RegisterVisitorComponent implements OnInit { // Adicionado 'implements OnInit'

  // AQUI ESTÁ A CORREÇÃO: Variável necessária para o header
  userName: string = 'Usuário';

  visitante = {
    name: '',
    documento: '',
    empresa: '',
    telefone: '',
    email: ''
  };
  
  visita = {
    pessoaVisitada: '',
    departamento: '',
    motivo: '',
    observacoes: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  // Lógica para pegar o nome/função do usuário
  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role === 'admin') {
      this.userName = 'Administrador';
    } else if (role === 'recepcionista') {
      this.userName = 'Recepcionista';
    }
  }

  registrarVisita(): void {
    console.log('Visitante:', this.visitante);
    console.log('Visita:', this.visita);
    alert('Visitante registrado com sucesso!');
    this.router.navigate(['/dashboard']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}