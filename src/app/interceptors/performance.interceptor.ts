import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

interface CacheEntry {
  response: Observable<HttpEvent<any>>;
  timestamp: number;
}

@Injectable()
export class PerformanceInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheEntry>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes cache expiration

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method === 'GET' && req.url.includes('assets/data/')) {
      const cachedEntry = this.cache.get(req.url);
      const now = Date.now();
      
      // Check if cache exists and hasn't expired
      if (cachedEntry && (now - cachedEntry.timestamp) < this.cacheTimeout) {
        console.log(`Serving from cache: ${req.url}`);
        return cachedEntry.response;
      }

      const response = next.handle(req).pipe(
        shareReplay(1),
        tap((event) => {
          if (event instanceof HttpResponse) {
            console.log(`Caching response for: ${req.url}`);
            this.cache.set(req.url, {
              response: of(event),
              timestamp: now
            });
          }
        })
      );

      return response;
    }

    return next.handle(req);
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if ((now - entry.timestamp) >= this.cacheTimeout) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}
