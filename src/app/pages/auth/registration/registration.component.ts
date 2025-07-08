import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../models/users';
import { ConfigService } from '../../../services/config/config.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  login: string;
  password: string;
  repeatPassword: string;
  cardNumber: string = '';
  email: string;
  isRemember: boolean;
  isShowCardNumber: boolean;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isShowCardNumber = ConfigService.config.useUserCard;
  }

  ngOnDestroy(): void {}

  onAuth(): void {
    if (this.password !== this.repeatPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Passwords are not the same',
      });
      return;
    }
    const user: IUser = {
      login: this.login,
      psw: this.password,
      cardNumber: this.cardNumber,
      email: this.email,
    };
    this.authService.registerUserOnServer(user).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Регистрация прошла успешно',
        });
        this.authService.authUserOnServer(user).subscribe(
          () => {
            console.log('Redirecting to tickets/ticket-list');
            this.router.navigate(['tickets', 'ticket-list']);
          },
          (authErr) => {
            console.error('Ошибка авторизации после регистрации', authErr);
            this.messageService.add({
              severity: 'warn',
              summary: 'Ошибка авторизации после регистрации',
            });
          }
        );
      },
      (regErr) => {
        console.error('Ошибка регистрации', regErr);
        this.messageService.add({
          severity: 'warn',
          summary: 'Пользователь уже зарегистрирован',
        });
      }
    );
  }
}
