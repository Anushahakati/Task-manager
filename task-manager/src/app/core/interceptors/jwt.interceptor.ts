import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

// This is a modern "functional" interceptor
export const jwtInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Get the token from local storage
  const token = localStorage.getItem('token');

  // If the token exists, clone the request and add the authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Pass the cloned or original request to the next handler
  return next(req);
};
