import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gerencia-visita',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gerencia-visita.html',
  styleUrls: ['./gerencia-visita.css']
})
export class GerenciaVisita implements OnInit {
  
  // AQUI ESTÁ A CORREÇÃO: Definindo a variável que o HTML pede
  userName: string = 'Usuário';

  visitantesAtivos: number = 0;
  visitasHoje: number = 0;
  totalDoMes: number = 0;
  saidasHoje: number = 0;
  activeTab: string = 'ativos';
  visitantes: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Lógica para preencher o nome do usuário no header
    const role = this.authService.getRole();
    if (role === 'admin') {
      this.userName = 'Administrador';
    } else if (role === 'recepcionista') {
      this.userName = 'Recepcionista';
    }

    this.carregarDados();
  }

  carregarDados(): void {
    this.visitantesAtivos = 0;
    this.visitasHoje = 12;
    this.totalDoMes = 245;
    this.saidasHoje = 7;
  }

  selecionarTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'ativos') {
      this.visitantes = [];
    } else {
      this.visitantes = [ {id: 1, nome: 'Visitante de Histórico'} ]; 
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}