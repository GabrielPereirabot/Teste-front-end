import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  userName: string = 'Usuário';
  visitantesHoje: number = 0;
  visitantesAtivos: number = 0;
  totalDoMes: number = 0;

  isUserAdmin: boolean = false;

  // 2. Injetar o Router (além do AuthService que já estava)
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.isUserAdmin = this.authService.getUserRole() === 'ADMIN';
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.visitantesHoje = 12;
    this.visitantesAtivos = 5;
    this.totalDoMes = 245;
  }

  logout(): void {
    this.authService.logout();
  }
}
