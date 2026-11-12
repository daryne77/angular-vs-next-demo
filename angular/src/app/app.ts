import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav><a routerLink="/users">Users</a><a routerLink="/roles">Roles</a></nav>
    <main><router-outlet /></main>
  `,
})
export class App {}
