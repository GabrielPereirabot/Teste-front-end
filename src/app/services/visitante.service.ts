import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importação do HttpClient
import { Observable, of } from 'rxjs'; // Importação de Observable e 'of' para simulação
import { tap } from 'rxjs/operators'; // Importação do operador 'tap'

@Injectable({
  providedIn: 'root'
})
export class VisitanteService {
  // --- Configuração da Conexão com o Back-end ---
  private apiUrl = 'http://localhost:8080/api/visitantes'; // URL base do seu VisitanteController.java

  // --- Estrutura de Simulação Interna (A ser mantida por enquanto) ---
  private visitantesAtivos: any[] = [];
  private _visitasHoje: number = 0;
  private _totalDoMes: number = 0;
  private _saidasHoje: number = 0; 
  
  // O construtor agora injeta o HttpClient
  constructor(private http: HttpClient) { 
    // Se quiser manter os valores estáticos iniciais:
    // this._visitasHoje = 12; 
    // this._totalDoMes = 245; 
    // this._saidasHoje = 7; 
  }

  // --- MÉTODOS DE COMUNICAÇÃO HTTP (Reais) ---

  /**
   * Registra uma nova visita. Agora faz uma requisição POST real.
   * @param visitante Objeto com dados do visitante/visita.
   * @returns Observable com a resposta do backend.
   */
  registrarVisita(visitante: any): Observable<any> {
    // 1. Faz a chamada HTTP POST para o endpoint de registro
    return this.http.post<any>(this.apiUrl, visitante).pipe(
      // 2. Usa 'tap' para manter a simulação interna/contadores atualizados APÓS o sucesso do backend
      tap(response => {
        // Logica de simulação que você tinha (mantida aqui para atualizar os contadores no front)
        const novoVisitante = { ...response, status: 'Ativo' }; // Assume que o backend retorna o objeto criado
        this.visitantesAtivos.push(novoVisitante);
        this._visitasHoje++;
        this._totalDoMes++; 
      })
    );
  }

  /**
   * Obtém a lista de visitantes ativos. Agora faz uma requisição GET real.
   * Chama: GET /api/visitantes/ativos
   * @returns Observable com a lista de visitantes ativos.
   */
  getVisitantesAtivosHttp(): Observable<any[]> {
    // Chama o endpoint GET /api/visitantes/ativos
    return this.http.get<any[]>(`${this.apiUrl}/ativos`).pipe(
      // Opcional: Atualiza a lista interna (this.visitantesAtivos) com os dados do backend
      tap(ativos => {
        this.visitantesAtivos = ativos;
      })
    );
  }

  /**
   * Registra a saída de um visitante. Agora faz uma requisição PUT real.
   * Chama: PUT /api/visitantes/{id}/saida
   * @param id ID do visitante.
   * @returns Observable com o objeto atualizado.
   */
  registrarSaidaHttp(id: number): Observable<any> {
    // Chama o endpoint PUT /api/visitantes/{id}/saida
    return this.http.put<any>(`${this.apiUrl}/${id}/saida`, {}).pipe(
      tap(() => {
        // Lógica de simulação (mantida para atualizar os contadores e a lista interna)
        const index = this.visitantesAtivos.findIndex(v => v.id === id);
        if (index !== -1) {
          this.visitantesAtivos.splice(index, 1);
          this._saidasHoje++; 
        }
      })
    );
  }


  // --- MÉTODOS DE SIMULAÇÃO (Mantidos para o componente de gerenciamento) ---
  
  // OBS: Este método se torna obsoleto, mas é mantido se algum outro componente o usa diretamente
  adicionarVisitante(visitante: any): void {
    // Este método não deve ser chamado no futuro; use registrarVisita(visitante)
  }
  
  // GETTERS E ARRAY SIMULADOS (Mantidos para não quebrar o GerenciaVisitaComponent)
  getVisitantesAtivos(): any[] {
    return this.visitantesAtivos; // Retorna a lista interna
  }
  
  get visitasHoje(): number {
    return this._visitasHoje;
  }

  get totalDoMes(): number {
    return this._totalDoMes;
  }

  get saidasHoje(): number {
    return this._saidasHoje;
  }

  // OBS: Este método se torna obsoleto, mas é mantido se algum outro componente o usa diretamente
  registrarSaida(id: number): void {
    // Este método não deve ser chamado no futuro; use registrarSaidaHttp(id)
  }
}