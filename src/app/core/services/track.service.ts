import { Injectable } from '@angular/core';
import { Track } from '../models/track';
import { BehaviorSubject, catchError, from, map, Observable, of } from 'rxjs';
import { IDBPDatabase, openDB } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private dbName = 'TrackDB';
  private storeName = 'tracks';

  private openDatabase(): Observable<IDBDatabase> {
    return new Observable(observer => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => observer.error(request.error);
      request.onsuccess = () => observer.next(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  addTrack(track: Track): Observable<void> {
    return new Observable(observer => {
      this.openDatabase().subscribe(db => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(track);
        request.onsuccess = () => {
          observer.next();
          observer.complete();
        };
        request.onerror = () => observer.error(request.error);
      });
    });
  }

  getTracks(): Observable<Track[]> {
    return new Observable(observer => {
      this.openDatabase().subscribe(db => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onsuccess = () => observer.next(request.result as Track[]);
        request.onerror = () => observer.error(request.error);
      });
    });
  }

}
