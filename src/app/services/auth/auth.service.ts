import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../models/users';
import { Router } from '@angular/router';
import { UserAccessService } from '../user-access/user-access.service';
import { UserRules } from '../../shared/mock/rules';
import { BehaviorSubject, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';

export const LOCAL_STORAGE_NAME = 'currentUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new Subject();
  user$ = this.userSubject.asObservable();

  private userBehaviorSubject = new BehaviorSubject(null);
  userBehavior$ = this.userBehaviorSubject.asObservable();
  private userStorage: IUser[] = [];
  private currentUser: IUser | null = null;

  private userBasketSubject = new Subject();
  basket$ = this.userBasketSubject.asObservable();

  private basketItems: any[] = [];

  private readonly TOKEN_KEY = 'jwt_token';

  constructor(
    private router: Router,
    private accessService: UserAccessService,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    const storedUser: IUser | null = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_NAME) || 'null'
    );
    if (storedUser) {
      this.userStorage.push(storedUser); // <--- добавляем пользователя в userStorage
      this.auth(storedUser);
    }
  }

  private getUser(login: string): IUser | null {
    return this.userStorage.find((user) => login === user.login) || null;
  }

  private auth(user: IUser, isRememberMe?: boolean) {
    console.log('user', user);
    this.currentUser = user;
    this.accessService.initAccess(UserRules);

    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(user));

    // send user to Subject
    this.userSubject.next(this.currentUser);
  }

  initUserToSubject(): void {
    this.userSubject.next(this.currentUser);
    this.userBehaviorSubject.next(this.currentUser);
  }

  addBasketToSubject(): void {
    const newItem = { id: Date.now(), user: this.currentUser };
    this.basketItems.push(newItem);
    this.userBasketSubject.next([...this.basketItems]);
  }

  setUser(user: IUser): void {
    this.currentUser = user;
  }

  private authAndRedirect(user: IUser, isRememberMe?: boolean) {
    this.auth(user, isRememberMe);
    this.router.navigate(['tickets', 'ticket-list']);
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser || !!localStorage.getItem(LOCAL_STORAGE_NAME);
  }
  get isUserInStore(): boolean {
    return !!localStorage.getItem(LOCAL_STORAGE_NAME);
  }

  get user(): IUser | null {
    return this.currentUser;
  }

  get token(): string | null {
    return this.isAuthenticated ? 'my-token' : null;
  }

  authUser(
    login: string,
    password: string,
    isRememberMe: boolean
  ): true | string {
    const user = this.getUser(login);
    if (!user) {
      return 'User not found';
    }
    if (user.psw !== password) {
      return 'Wrong password';
    }
    this.authAndRedirect(user, isRememberMe);
    return true;
  }

  addUser(user: IUser, isRememberMe?: boolean): true | string {
    if (this.getUser(user.login)) {
      return 'User already exists';
    }
    this.userStorage.push(user);
    this.authAndRedirect(user, isRememberMe);
    return true;
  }

  loginOnServer(user: IUser) {
    return this.http.post<{ access_token: string }>(
      'http://localhost:3000/auth/login',
      user
    );
  }

  saveToken(token: string) {
    console.log('Saving token:', token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('Getting token:', token);
    return token;
  }

  logout() {
    this.userStorage = this.userStorage.filter(
      ({ login }) => login === this.currentUser?.login
    );
    this.currentUser = null;
    localStorage.removeItem(LOCAL_STORAGE_NAME);
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['auth']);
  }

  changePassword(password: string) {
    if (!this.currentUser) {
      return;
    }
    this.currentUser.psw = password;
    const dbUser = this.userStorage.find(
      ({ login }) => login === this.currentUser?.login
    )!;
    dbUser.psw = password;
  }

  registerUserOnServer(user: IUser) {
    return this.http.post<IUser>('http://localhost:3000/auth/register', user);
  }

  authUserOnServer(authUser: IUser) {
    return this.http.post<IUser>('http://localhost:3000/auth/login', authUser);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('isTokenExpired: no token');
      return true;
    }
    try {
      const decoded: any = jwtDecode(token);
      console.log('isTokenExpired: decoded token:', decoded);
      if (!decoded.exp) {
        console.log('isTokenExpired: no exp field');
        return false;
      }
      const now = Math.floor(Date.now() / 1000);
      console.log(
        'isTokenExpired: current time:',
        now,
        'exp time:',
        decoded.exp
      );
      const isExpired = decoded.exp < now;
      console.log('isTokenExpired: token expired?', isExpired);
      return isExpired;
    } catch (e) {
      console.error('isTokenExpired: error decoding token:', e);
      return true;
    }
  }

  checkTokenAndLogoutIfExpired(showMessage = false) {
    if (this.isTokenExpired()) {
      if (showMessage) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Сессия истекла. Пожалуйста, войдите снова.',
        });
      }
      this.logout();
    }
  }
}
