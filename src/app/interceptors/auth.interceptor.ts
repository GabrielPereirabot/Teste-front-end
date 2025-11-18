import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone a requisição para adicionar os headers e credenciais
  let newReq = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json'),
    withCredentials: true
  });

  // Se tiver token, adiciona o header de autorização
  if (token) {
    newReq = newReq.clone({
      headers: newReq.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(newReq);
};