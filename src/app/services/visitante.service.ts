import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// Se você tiver uma interface, importe-a. Se não, usamos 'any' por enquanto.
// import { Visitante } from '../interfaces/visitante.interface'; 

@Injectable({
  providedIn: 'root'
})
export class VisitanteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/visitante`;

  /** Lista todos os visitantes */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  /** Busca um visitante por ID */
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /** Cria um novo visitante */
  create(visitante: any): Observable<any> {
    const body = this.buildVisitantePayload(visitante);
    return this.http.post<any>(this.baseUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /** Atualiza um visitante existente */
  update(id: string, visitante: any): Observable<any> {
    const body = this.buildVisitantePayload(visitante);
    return this.http.put<any>(`${this.baseUrl}/${id}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /** Deleta um visitante */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** * 🔧 Monta o payload com formato aceito pelo backend (VisitanteRequestDTO)
   * Mapeia os campos do formulário (frontend) para o DTO do Java (backend)
   */
  private buildVisitantePayload(visitante: any) {
    return {
      // Mapeia 'name' do formulário para 'nomeCompleto' da API
      nomeCompleto: visitante.name || visitante.nomeCompleto,
      
      // Mapeia 'documento' do formulário para 'cpf' da API
      cpf: visitante.documento || visitante.cpf,
      
      telefone: visitante.telefone,
      
      // Campos opcionais ou fixos (ajuste conforme sua necessidade)
      sexo: visitante.sexo || null,
      documentoIdentidade: visitante.documentoIdentidade || null,
      foto: visitante.foto || null,

      // Tratamento de Data igual ao do UserService
      dataNascimento: visitante.dataNascimento || visitante.data_nascimento
        ? new Date(visitante.dataNascimento || visitante.data_nascimento).toISOString().split('T')[0]
        : null // Envia null se não tiver data (Backend deve tratar ou você define uma padrão)
    };
  }
}