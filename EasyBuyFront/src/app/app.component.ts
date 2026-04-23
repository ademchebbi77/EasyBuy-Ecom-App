import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar *ngIf="!isAuthPage"></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isAuthPage"></app-footer>
  `
})
export class AppComponent {
  title = 'EasyToBuy';
  isAuthPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAuthPage = event.url.includes('/auth/') || event.url.includes('/admin');
    });
  }
}