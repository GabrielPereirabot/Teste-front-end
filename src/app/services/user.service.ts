import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/user`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /** Cria um novo usuário */
  create(user: Partial<User>): Observable<User> {
    const body = this.buildUserPayload(user);
    return this.http.post<User>(this.baseUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /** Atualiza um usuário existente */
  update(id: string, user: Partial<User>): Observable<User> {
    const body = this.buildUserPayload(user);
    return this.http.put<User>(`${this.baseUrl}/${id}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** 🔧 Monta o payload com formato aceito pelo backend */
  private buildUserPayload(user: Partial<User>) {
    return {
      name: user.name,
      cpf: user.cpf,
      documento_identidade: user.documento_identidade,
      sexo: user.sexo,
      data_nascimento: user.data_nascimento
        ? new Date(user.data_nascimento).toISOString().split('T')[0]
        : null,
      telefone: user.telefone,
      email: user.email,
      login: user.login,
      password: user.password,
      role: user.role,
    };
  }
}
