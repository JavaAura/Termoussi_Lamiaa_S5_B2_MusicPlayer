import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Track } from '../models/track';
import {   from, Observable, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private dbName = 'TrackDB';
  private storeName = 'tracks';
  private db: IDBDatabase | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private isIndexedDBAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && 'indexedDB' in window;
  }

  private openDatabase(): Promise<IDBDatabase> {
    if (!this.isIndexedDBAvailable()) {
      return Promise.reject(new Error('IndexedDB is not available in this environment'));
    }

    return new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const request = window.indexedDB.open(this.dbName, 1);

        request.onerror = () => {
          reject(request.error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve(request.result);
        };

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, {
              keyPath: 'id',
              autoIncrement: true
            });
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  addTrack(track: Track): Observable<void> {
    if (!this.isIndexedDBAvailable()) {
      return of(undefined);
    }

    return from(this.openDatabase()).pipe(
      switchMap(db => {
        return new Promise<void>((resolve, reject) => {
          try {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            const request = store.add({
              ...track,
              addedDate: new Date()
            });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          } catch (error) {
            reject(error);
          }
        });
      }),
      catchError(error => {
        console.error('Error adding track:', error);
        return throwError(() => error);
      })
    );
  }

  getTracks(): Observable<Track[]> {
    if (!this.isIndexedDBAvailable()) {
      return of([]);
    }

    return from(this.openDatabase()).pipe(
      switchMap(db => {
        return new Promise<Track[]>((resolve, reject) => {
          try {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as Track[]);
            request.onerror = () => reject(request.error);
          } catch (error) {
            reject(error);
          }
        });
      }),
      catchError(error => {
        console.error('Error getting tracks:', error);
        return throwError(() => error);
      })
    );
  }

  deleteTrack(id: number): Observable<void> {
    if (!this.isIndexedDBAvailable()) {
      return of(undefined);
    }

    return from(this.openDatabase()).pipe(
      switchMap(db => {
        return new Promise<void>((resolve, reject) => {
          try {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          } catch (error) {
            reject(error);
          }
        });
      }),
      catchError(error => {
        console.error('Error deleting track:', error);
        return throwError(() => error);
      })
    );
  }

  updateTrack(track: Track): Observable<void> {
    if (!this.isIndexedDBAvailable()) {
      return of(undefined);
    }

    return from(this.openDatabase()).pipe(
      switchMap(db => {
        return new Promise<void>((resolve, reject) => {
          try {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(track);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          } catch (error) {
            reject(error);
          }
        });
      }),
      catchError(error => {
        console.error('Error updating track:', error);
        return throwError(() => error);
      })
    );
  }


}
