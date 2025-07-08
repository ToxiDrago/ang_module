import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../models/users';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
})
export class AuthorizationComponent implements OnInit {
  login: string;
  password: string;
  cardNumber: string = '';
  isRememberMe: boolean;
  isHaveCard: boolean;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onAuth(): void {
    const user: IUser = {
      login: this.login,
      psw: this.password,
      cardNumber: this.cardNumber,
      email: '',
    };
    this.authService.loginOnServer(user).subscribe(
      (data) => {
        console.log('Login successful, token received:', data);
        this.authService.saveToken(data.access_token);
        this.messageService.add({
          severity: 'success',
          summary: 'Вы авторизованы!',
        });
        console.log('About to navigate to tickets/ticket-list');
        this.router.navigate(['tickets', 'ticket-list']);
      },
      (err) => {
        console.error('Login error:', err);
        this.messageService.add({ severity: 'warn', summary: 'Ошибка' });
      }
    );
  }
}
