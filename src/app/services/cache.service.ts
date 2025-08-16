import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos
  private cacheTimestamps = new Map<string, number>();

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    const cached = this.cache.get(url);
    const timestamp = this.cacheTimestamps.get(url);
    const now = Date.now();

    // Si existe en cache y no ha expirado, devolver del cache
    if (cached && timestamp && (now - timestamp) < this.cacheTimeout) {
      console.log(`Cache hit for: ${url}`);
      return of(cached);
    }

    // Si no existe o ha expirado, hacer request HTTP
    console.log(`Cache miss for: ${url}`);
    return this.http.get<T>(url).pipe(
      tap(data => {
        this.cache.set(url, data);
        this.cacheTimestamps.set(url, now);
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  clearCacheItem(url: string): void {
    this.cache.delete(url);
    this.cacheTimestamps.delete(url);
  }
}
