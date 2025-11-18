import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para o login e armazena a URL que estava tentando acessar
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
