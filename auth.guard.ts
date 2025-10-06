import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// This is a modern "functional" guard
export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // User has a token, allow access to the route
  }

  // No token found, redirect the user to the login page
  router.navigate(['/auth/login']);
  return false;
};
