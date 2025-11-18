import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from '../../components/add-user-dialog/add-user-dialog';



@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, MatDialogModule],
  templateUrl: './painel-admin.html',
  styleUrls: ['./painel-admin.css']
})
export class AdminPanelComponent implements OnInit {

  userName: string = 'Usuário';
  isUserAdmin: boolean = false;

  totalUsuarios = 0;
  totalAdmins = 0;
  totalRecepcionistas = 0;
  usuariosAtivos = 0;

  users: User[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.isUserAdmin = this.authService.getUserRole() === 'ADMIN';

    if (!this.isUserAdmin) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.userService.getAll().subscribe({
      next: (usuarios) => {
        this.users = usuarios;
        this.updateStats();
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
      }
    });
  }


  openDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: user ? user : {}
    });

    dialogRef.afterClosed().subscribe((savedUser: User | undefined) => {
      if (savedUser) {
        // Recarrega a lista do servidor
        this.carregarUsuarios();

        // OU, se quiser atualizar localmente sem recarregar:
        // const index = this.users.findIndex(u => u.id === savedUser.id);
        // if (index > -1) this.users[index] = savedUser;
        // else this.users.push(savedUser);

        this.updateStats(); // Atualiza os contadores
      }
    });
  }


  deleteUser(user: User): void {
    Swal.fire({
      title: 'Atenção!',
      text: `Deseja realmente deletar ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(user.id!).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.updateStats();
            Swal.fire('Deletado!', `${user.name} foi removido.`, 'success');
          },
          error: err => Swal.fire('Erro!', 'Não foi possível deletar o usuário.', 'error')
        });
      }
    });
  }


  editUser(user: User): void {
  const dialogRef = this.dialog.open(UserDialogComponent, {
    width: '700px',
    data: user // 🔥 envia o usuário para o modal
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Atualiza a lista na tela
      const index = this.users.findIndex(u => u.id === result.id);
      if (index !== -1) {
        this.users[index] = result;
      }
      this.updateStats();
    }
  });
}

  private updateStats(): void {
    this.totalUsuarios = this.users.length;
    this.totalAdmins = this.users.filter(u => u.role === 'ADMIN').length;
    this.totalRecepcionistas = this.users.filter(u => u.role === 'RECEPCIONISTA').length;
    this.usuariosAtivos = this.users.filter(u => u.role !== '').length; // Ajuste se tiver campo "ativo"
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  getRoleLabel(role: string): string {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'Admin';
      case 'USER':
        return 'Atendente'; // neutro
      default:
        return role;
    }
  }
}
