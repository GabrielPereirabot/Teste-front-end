import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  userName: string = 'Administrador';
  visitantesHoje: number = 0;
  visitantesAtivos: number = 0;
  totalDoMes: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Aqui você faria a chamada a uma API para buscar os dados reais
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    // Exemplo de dados mocados (simulados)
    this.visitantesHoje = 12;
    this.visitantesAtivos = 5;
    this.totalDoMes = 245;
  }

  // Métodos para navegação (a serem implementados com o Router)
  registrarNovaVisita(): void {
    console.log('Navegando para a página de registro de visita...');
    // this.router.navigate(['/nova-visita']);
  }

  verVisitantes(): void {
    console.log('Navegando para a página de gerenciamento de visitantes...');
    // this.router.navigate(['/gerenciar-visitantes']);
  }

  acessarPainelAdmin(): void {
    console.log('Navegando para o painel de administração...');
    // this.router.navigate(['/admin']);
  }
}
