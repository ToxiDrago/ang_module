import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    console.log('AuthGuard: checking access to', state.url);
    this.authService.checkTokenAndLogoutIfExpired(true);
    const token = this.authService.getToken();
    console.log('AuthGuard: token exists?', !!token);
    if (!token) {
      console.log('AuthGuard: no token, redirecting to /auth');
      return this.router.createUrlTree(['/auth']);
    }
    console.log('AuthGuard: access granted');
    return true;
  }
}
