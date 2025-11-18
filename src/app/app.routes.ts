import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
// Verifique se a pasta no seu computador se chama 'painel-admin' ou 'admin-panel'
import { AdminPanelComponent } from './pages/painel-admin/painel-admin';
import { GerenciaVisita } from './pages/gerencia-visita/gerencia-visita';

// --- CORREÇÃO PRINCIPAL AQUI ---
// O nome da classe dentro do arquivo é RegisterVisitorComponent
import { RegisterVisitorComponent } from './pages/register-visita/register-visita';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminPanelComponent },
  
  // Esta rota deve ser igual ao routerLink="/registar-visitas" do seu botão
  { path: 'registar-visitas', component: RegisterVisitorComponent }, 
  
  { path: 'gerenciar-visitas', component: GerenciaVisita },
];
