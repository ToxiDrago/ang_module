import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../models/users';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onAuth(): void {
    const user: IUser = {
      id: '',
      login: this.login,
      psw: this.password,
      cardNumber: this.cardNumber,
      email: '',
    };
    this.authService.authUserOnServer(user).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Вы авторизованы!',
        });
      },
      (err) => {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка' });
      }
    );
  }
}
