import type { HttpInterceptorFn } from '@angular/common/http';
import { AppSettings } from '../app.settings';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const appSettings = AppSettings;
  const authReq = req.clone({
    setHeaders: {
      'X-CoinAPI-Key' : appSettings.apiKey
    }
  });
  return next(authReq);
};
