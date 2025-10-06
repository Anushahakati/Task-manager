import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Mark the component as standalone
  imports: [
    RouterOutlet // Import RouterOutlet to render your routes
  ],
  template: `
    <!-- This is where your routed components (Login, Dashboard, etc.) will be displayed -->
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
