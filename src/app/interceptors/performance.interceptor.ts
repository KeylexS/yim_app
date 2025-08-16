import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements HttpInterceptor {
  private cache = new Map<string, Observable<HttpEvent<any>>>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method === 'GET' && req.url.includes('assets/data/')) {
      const cachedResponse = this.cache.get(req.url);
      
      if (cachedResponse) {
        console.log(`Serving from cache: ${req.url}`);
        return cachedResponse;
      }

      const response = next.handle(req).pipe(
        shareReplay(1),
        tap((event) => {
          if (event instanceof HttpResponse) {
            console.log(`Caching response for: ${req.url}`);
          }
        })
      );

      this.cache.set(req.url, response);
      return response;
    }

    return next.handle(req);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
