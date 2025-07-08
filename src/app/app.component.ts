import { Component } from '@angular/core';
import { ObservableExampleService } from './services/observable-example/observable-example.service';
import { ConfigService } from './services/config/config.service';
import { AuthService } from './services/auth/auth.service';
import { IUser } from './models/users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ticketSales2022';

  constructor(
    private test: ObservableExampleService,
    private configService: ConfigService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.checkTokenAndLogoutIfExpired();
  }

  get isAuthenticated(): boolean {
    return !!this.authService.getToken();
  }

  get currentUser(): IUser | null {
    return this.authService.user;
  }

  logout() {
    this.authService.logout();
  }
}
