import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// Importa o AuthService e a interface Visita para tipagem correta
import { AuthService, Visita } from '../../services/auth.service'; 

@Component({
  selector: 'app-register-visitor',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register-visita.html',
  styleUrls: ['./register-visita.css']
})
export class RegisterVisitorComponent implements OnInit {

  userName: string = 'Usuário';
  selectedFile: File | null = null; 

  // Dados do formulário
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

  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role === 'admin') {
      this.userName = 'Administrador';
    } else if (role === 'recepcionista') {
      this.userName = 'Recepcionista';
    }
  }

  registrarVisita(): void {
    // Validação simples dos campos obrigatórios
    if (!this.visitante.name || !this.visitante.documento || !this.visita.pessoaVisitada || !this.visita.motivo) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Gera um ID temporário (em produção, o backend faria isso)
    const novoId = Math.floor(Math.random() * 1000000); 

    // Cria o objeto Visita completo, incluindo o status inicial
    const novaVisita: Visita = {
        id: novoId, 
        nomeCompleto: this.visitante.name,
        documentoIdentidade: this.visitante.documento,
        pessoaVisitada: this.visita.pessoaVisitada,
        motivo: this.visita.motivo,
        horaEntrada: new Date(),
        status: 'Ativo' // Importante: Define o status inicial para aparecer na aba 'Ativos'
    };

    // Envia para o serviço (atualiza as listas em tempo real)
    this.authService.notifyNewVisit(novaVisita);
    
    // Feedback e redirecionamento
    alert(`Visitante registrado com sucesso! ID: ${novoId}.`);
    
    // Limpa o formulário
    this.visitante = { name: '', documento: '', empresa: '', telefone: '', email: '' };
    this.visita = { pessoaVisitada: '', departamento: '', motivo: '', observacoes: '' };
    this.selectedFile = null;

    // Vai para a tela de gerenciamento para ver o novo registro
    this.router.navigate(['/gerencia-visita']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; 
      console.log('Arquivo selecionado:', file.name);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}