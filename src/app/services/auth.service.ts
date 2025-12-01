import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { LoginCredentials, AuthResponse } from '../interfaces/auth.interface';
import { environment } from '../../environments/environment';

export interface Visita {
    id: number;
    nomeCompleto: string;
    documentoIdentidade: string;
    pessoaVisitada: string;
    motivo: string;
    horaEntrada: Date;
    horaSaida?: Date;
    status: 'Ativo' | 'Finalizado';
}

export interface VisitasMetrics {
    visitasHoje: number;
    totalDoMes: number;
    saidasHoje: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

    // --- Estado Compartilhado ---
    
    // Lista de Ativos
    private _listaAtivos: Visita[] = [];
    private ativosSubject = new BehaviorSubject<Visita[]>(this._listaAtivos);
    public activeVisits$ = this.ativosSubject.asObservable();

    // Lista de Histórico (Tudo)
    private _listaHistorico: Visita[] = [];
    private historicoSubject = new BehaviorSubject<Visita[]>(this._listaHistorico);
    public historyVisits$ = this.historicoSubject.asObservable();

    // Métricas (Inicializadas com 0)
    private _metrics: VisitasMetrics = { visitasHoje: 0, totalDoMes: 0, saidasHoje: 0 };
    private metricsSubject = new BehaviorSubject<VisitasMetrics>(this._metrics);
    public metrics$ = this.metricsSubject.asObservable();

    // --- Lógica de Recálculo (30 Dias) ---
    private recalcularMetricas(): void {
        const agora = new Date();
        const inicioDoDia = new Date(new Date().setHours(0,0,0,0));
        
        // Data limite para o filtro (Hoje - 30 dias)
        const dataLimite30Dias = new Date();
        dataLimite30Dias.setDate(new Date().getDate() - 30);

        // 1. Visitas Hoje (Entradas registradas hoje)
        const entradasHoje = this._listaHistorico.filter(v => {
            return new Date(v.horaEntrada) >= inicioDoDia;
        }).length;

        // 2. Saídas Hoje (Finalizadas hoje)
        const saidasHoje = this._listaHistorico.filter(v => {
            if (!v.horaSaida) return false;
            const dataSaida = new Date(v.horaSaida);
            return dataSaida >= inicioDoDia;
        }).length;

        // 3. Total do Mês (Filtra registros dos últimos 30 dias)
        const totalMes = this._listaHistorico.filter(v => {
            const dataVisita = new Date(v.horaEntrada);
            return dataVisita >= dataLimite30Dias;
        }).length;

        // Atualiza o estado
        this._metrics = {
            visitasHoje: entradasHoje,
            totalDoMes: totalMes,
            saidasHoje: saidasHoje
        };
        this.metricsSubject.next({ ...this._metrics });
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials, { headers, withCredentials: true })
          .pipe(tap(response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', response.name);
            localStorage.setItem('role', response.role);
          }));
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        this.router.navigate(['/login']);
    }

    // --- 3. Lógica Principal de Dados ---

    // Chamado quando entra uma nova visita
    notifyNewVisit(novaVisita: Visita): void {
        console.log('AuthService: Nova visita registrada.');
        
        // 1. Adiciona na lista de ATIVOS
        this._listaAtivos = [...this._listaAtivos, novaVisita];
        this.ativosSubject.next(this._listaAtivos);

        // 2. Adiciona na lista de HISTÓRICO também!
        this._listaHistorico = [...this._listaHistorico, novaVisita];
        this.historicoSubject.next(this._listaHistorico);

        // 3. Recalcula Métricas
        this.recalcularMetricas();
    }
    
    // Chamado quando a visita finaliza
    finalizeVisit(id: number): void {
        console.log(`AuthService: Finalizando visita ID ${id}.`);
        
        // 1. REMOVE da lista de ATIVOS (para sair da aba "Ativos")
        this._listaAtivos = this._listaAtivos.filter(v => v.id !== id);
        this.ativosSubject.next(this._listaAtivos);

        // 2. ATUALIZA na lista de HISTÓRICO (Muda status para 'Finalizado' e põe hora de saída)
        this._listaHistorico = this._listaHistorico.map(v => {
            if (v.id === id) {
                return { 
                    ...v, 
                    status: 'Finalizado', 
                    horaSaida: new Date() 
                };
            }
            return v;
        });
        this.historicoSubject.next(this._listaHistorico);

        // 3. Recalcula Métricas
        this.recalcularMetricas();
    }

    getToken(): string | null { return localStorage.getItem('token'); }
    isAuthenticated(): boolean { return !!this.getToken(); }
    getUserName(): string {
        const fullName = localStorage.getItem('userName') || 'Usuário';
        const firstName = fullName.split(' ')[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }
    getUserRole(): string { return localStorage.getItem('role') ?? 'USER'; }
    getRole(): string | null {
        const role = this.getUserRole();
        return role ? role.toLowerCase() : null;
    }
    isAdmin(): boolean {
        const role = this.getUserRole();
        return role.toUpperCase() === 'ADMIN';
    }
}