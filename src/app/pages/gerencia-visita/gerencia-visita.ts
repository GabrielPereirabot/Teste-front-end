import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, DatePipe } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router';
// Importa o AuthService e as interfaces necessárias
import { AuthService, Visita, VisitasMetrics } from '../../services/auth.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-gerencia-visita',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe], 
  templateUrl: './gerencia-visita.html',
  styleUrls: ['./gerencia-visita.css']
})
export class GerenciaVisita implements OnInit, OnDestroy { 

  userName: string = 'Usuário';
  activeTab: string = 'ativos';
  
  // Listas de dados (atualizadas via serviço)
  visitasAtivas: Visita[] = []; 
  visitasHistorico: Visita[] = []; 

  // Métricas dinâmicas
  visitasHoje: number = 0;
  totalDoMes: number = 0;
  saidasHoje: number = 0;

  // Gerenciador de subscrições
  private subs: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // Detecta mudanças manualmente para atualização instantânea
  ) { }

  ngOnInit(): void {
    // Recupera dados do usuário
    this.userName = this.authService.getUserName();
    
    // --- INSCRIÇÕES NOS OBSERVABLES (TEMPO REAL) ---

    // 1. Lista de Visitantes Ativos
    const activeSub = this.authService.activeVisits$.subscribe(
        (visitas: Visita[]) => {
            this.visitasAtivas = visitas;
            this.cdr.detectChanges(); // Força atualização da tela
        }
    );
    this.subs.add(activeSub);

    // 2. Lista de Histórico Completo
    const historySub = this.authService.historyVisits$.subscribe(
        (visitas: Visita[]) => {
            // Cria uma cópia e inverte para mostrar os mais recentes no topo
            this.visitasHistorico = [...visitas].reverse(); 
            this.cdr.detectChanges();
        }
    );
    this.subs.add(historySub);

    // 3. Métricas (Contadores)
    const metricsSub = this.authService.metrics$.subscribe(
        (metrics: VisitasMetrics) => {
            this.visitasHoje = metrics.visitasHoje;
            this.totalDoMes = metrics.totalDoMes;
            this.saidasHoje = metrics.saidasHoje;
            this.cdr.detectChanges();
        }
    );
    this.subs.add(metricsSub);
  }
  
  ngOnDestroy(): void {
    // Limpa todas as inscrições ao sair da página
    this.subs.unsubscribe();
  }

  selecionarTab(tab: string): void {
    this.activeTab = tab;
  }
  
  finalizarVisita(id: number): void {
    console.log(`Solicitando finalização da visita ID: ${id}`);

    // Chama o AuthService para atualizar o status e mover para histórico
    this.authService.finalizeVisit(id);
    
    alert(`Visita ID ${id} finalizada! Histórico atualizado.`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}