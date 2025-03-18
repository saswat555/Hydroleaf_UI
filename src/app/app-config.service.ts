import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ConnectionMode = 'LAN' | 'CLOUD';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  // Default values; you can also read from localStorage
  private connectionModeSubject = new BehaviorSubject<ConnectionMode>('LAN');
  connectionMode$ = this.connectionModeSubject.asObservable();

  // For theme toggling
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  get connectionMode(): ConnectionMode {
    return this.connectionModeSubject.value;
  }

  setConnectionMode(mode: ConnectionMode) {
    this.connectionModeSubject.next(mode);
    localStorage.setItem('connectionMode', mode);
  }

  get darkMode(): boolean {
    return this.darkModeSubject.value;
  }

  setDarkMode(isDark: boolean) {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }
}
