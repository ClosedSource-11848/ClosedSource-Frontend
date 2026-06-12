import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

/**
 * HTTP interceptor that attaches the current JWT bearer token to outgoing requests.
 *
 * @remarks
 * This interceptor belongs to the IAM infrastructure layer. It obtains the
 * current token from IamStore and, when available, adds it to the Authorization
 * header using the Bearer scheme.
 *
 * Because IamStore now restores session state from localStorage, authenticated
 * requests keep working after a browser refresh.
 */
export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const iamStore = inject(IamStore);
  const token = iamStore.currentToken();

  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authenticatedRequest);
};
