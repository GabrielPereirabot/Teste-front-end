import { HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor de Autenticação: Adiciona o Token JWT ao cabeçalho Authorization
 * para todas as requisições, permitindo que o backend valide a sessão.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Clone inicial da requisição. Mantemos o withCredentials: true aqui, 
  // caso seja necessário para o seu backend.
  let newReq = req.clone({
    withCredentials: true
  });
  
  // Se o token existe, clonamos a requisição para adicionar o cabeçalho de Autorização.
  if (token) {
    newReq = newReq.clone({
      // Adicionamos o token no formato padrão JWT: Bearer <TOKEN>
      headers: newReq.headers.set('Authorization', `Bearer ${token}`)
    });
    
    console.log(`[AuthInterceptor] Token de autorização adicionado para: ${newReq.url}`);
  }

  return next(newReq);
};