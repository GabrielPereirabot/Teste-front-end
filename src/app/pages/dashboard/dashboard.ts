import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// Importa AuthService e a interface Visita para manipulação de dados
import { AuthService, Visita, VisitasMetrics } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userName: string = 'Usuário';
  // Inicializa com 0 conforme solicitado
  visitantesHoje: number = 0;
  visitantesAtivos: number = 0;
  totalDoMes: number = 0;

  isUserAdmin: boolean = false;
  
  // Gerenciamento de subscrições
  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Para atualização da UI
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    // Verificação de role segura
    const role = this.authService.getUserRole();
    this.isUserAdmin = role ? role.toUpperCase() === 'ADMIN' : false;
    
    this.iniciarMonitoramentoEmTempoReal();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  iniciarMonitoramentoEmTempoReal(): void {
    // 1. Visitantes Ativos: Pega o tamanho da lista de ativos em tempo real
    const activeSub = this.authService.activeVisits$.subscribe(lista => {
        this.visitantesAtivos = lista.length;
        this.cdr.detectChanges();
    });
    this.subs.add(activeSub);

    // 2. Visitantes Hoje: Pega do contador de métricas do serviço
    const metricsSub = this.authService.metrics$.subscribe((metrics: VisitasMetrics) => {
        this.visitantesHoje = metrics.visitasHoje;
        this.cdr.detectChanges();
    });
    this.subs.add(metricsSub);

    // 3. Total do Mês (Lógica Customizada de 30 dias)
    // Observa o histórico completo e filtra apenas os últimos 30 dias
    const historySub = this.authService.historyVisits$.subscribe((historico: Visita[]) => {
        this.calcularTotalUltimos30Dias(historico);
        this.cdr.detectChanges();
    });
    this.subs.add(historySub);
  }

  /**
   * Filtra a lista de histórico para contar apenas registros feitos nos últimos 30 dias.
   */
  calcularTotalMes(listaHistorico: Visita[]): void {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() - 30); // Subtrai 30 dias da data atual

    // Filtra visitas onde a horaEntrada é maior ou igual a dataLimite
    const visitasNoPeriodo = listaHistorico.filter(v => {
        const dataVisita = new Date(v.horaEntrada);
        return dataVisita >= dataLimite;
    });

    this.totalDoMes = visitasNoPeriodo.length;
  }
  
  // Alias para manter compatibilidade com a chamada no subscribe
  private calcularTotalUltimos30Dias(historico: Visita[]) {
      this.calcularTotalMes(historico);
  }

  logout(): void {
    this.authService.logout();
  }
}