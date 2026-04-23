import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserInfo {
  sub: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  roles: string[];
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.reloadUserInfo();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', environment.keycloak.clientId);
    body.set('client_secret', environment.keycloak.clientSecret);
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<AuthResponse>(
        environment.keycloak.tokenEndpoint,
        body.toString(),
        { headers }
    ).pipe(
        tap(response => {
          this.saveTokens(response);
          this.reloadUserInfo();
        })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('user_service_id');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    try {
      const payload = this.parseJwt(token);
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Public so that LoginComponent can call it after storing user_service_id,
   * ensuring the userId is immediately reflected in currentUser$.
   */
  reloadUserInfo(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }

    try {
      const payload = this.parseJwt(token);

      // Keycloak puts roles under resource_access.<clientId>.roles
      // Try the gateway client first, then fall back to realm_access.roles
      const roles: string[] =
          payload.resource_access?.gateway?.roles ||
          payload.resource_access?.[environment.keycloak.clientId]?.roles ||
          payload.realm_access?.roles ||
          [];

      const userInfo: UserInfo = {
        sub: payload.sub,
        email: payload.email,
        preferred_username: payload.preferred_username,
        name: payload.name,
        roles,
        userId: parseInt(localStorage.getItem('user_service_id') || '0') || undefined
      };

      localStorage.setItem('user_info', JSON.stringify(userInfo));
      this.currentUserSubject.next(userInfo);
    } catch (error) {
      console.error('Error parsing token:', error);
      this.currentUserSubject.next(null);
    }
  }

  private saveTokens(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
  }
}