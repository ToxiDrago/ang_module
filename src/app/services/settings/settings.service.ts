import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ISettings } from '../../models/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settingSubject: Subject<ISettings> = new Subject<ISettings>();
  private SETTINGS_STORAGE_KEY = 'user_settings';

  constructor() {
    // Загружаем настройки из localStorage при инициализации
    const saved = localStorage.getItem(this.SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.settingSubject.next(parsed);
    }
  }

  loadUserSettings(): Observable<ISettings> {
    return new Observable<ISettings>((subscriber) => {
      const settingData = {
        saveToken: true,
      };
      subscriber.next(settingData);
    });
  }

  loadUserSettingsSubject(data: ISettings) {
    localStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(data));
    this.settingSubject.next(data);
  }

  getSettingsSubjectObservable() {
    return this.settingSubject.asObservable();
  }
}
