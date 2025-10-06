import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES), // <-- Use the new routes
    provideAnimations(),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
  ],
}).catch((err) => console.error(err));
