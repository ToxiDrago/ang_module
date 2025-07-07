import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth/auth.service';
import { IUser } from '../../../models/users';
import { ConfigService } from '../../../services/config/config.service';
import { HttpClient } from '@angular/common/http';

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
    private messageService: MessageService
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
      id: '',
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
        // Сразу авторизуем пользователя и делаем редирект
        this.authService.authUserOnServer(user).subscribe(
          () => {
            // редирект на tickets/tickets-list
            (this as any).router.navigate(['tickets/tickets-list']);
          },
          () => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Ошибка авторизации после регистрации',
            });
          }
        );
      },
      (err) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Пользователь уже зарегистрирован',
        });
      }
    );
  }
}
