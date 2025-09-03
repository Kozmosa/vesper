import { ProcessedSchedule, AppConfig } from '../types';

export class StorageManager {
  private readonly STORAGE_PERMISSION_KEY = 'schedule_analyzer_storage_permission';
  private readonly SCHEDULES_KEY = 'schedule_analyzer_schedules';
  private readonly CONFIG_KEY = 'schedule_analyzer_config';

  getStoragePermission(): boolean | null {
    try {
      const permission = localStorage.getItem(this.STORAGE_PERMISSION_KEY);
      return permission === null ? null : permission === 'true';
    } catch {
      return null;
    }
  }

  setStoragePermission(granted: boolean): void {
    try {
      localStorage.setItem(this.STORAGE_PERMISSION_KEY, granted.toString());
    } catch (error) {
      console.warn('Failed to save storage permission:', error);
    }
  }

  loadSchedules(): ProcessedSchedule[] {
    try {
      const stored = localStorage.getItem(this.SCHEDULES_KEY);
      if (!stored) return [];
      
      const schedules = JSON.parse(stored);
      
      // Parse date strings back to Date objects
      return schedules.map((schedule: any) => ({
        ...schedule,
        startDate: new Date(schedule.startDate),
        timeSlots: schedule.timeSlots.map((slot: any) => ({
          ...slot,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime)
        })),
        scheduleEntries: schedule.scheduleEntries.map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: new Date(entry.endTime)
        })),
        weeklySchedule: Object.fromEntries(
          Object.entries(schedule.weeklySchedule).map(([day, daySchedule]: [string, any]) => [
            day,
            {
              ...daySchedule,
              entries: daySchedule.entries.map((entry: any) => ({
                ...entry,
                startTime: new Date(entry.startTime),
                endTime: new Date(entry.endTime)
              })),
              freeSlots: daySchedule.freeSlots.map((slot: any) => ({
                ...slot,
                startTime: new Date(slot.startTime),
                endTime: new Date(slot.endTime)
              }))
            }
          ])
        )
      }));
    } catch (error) {
      console.warn('Failed to load schedules from storage:', error);
      return [];
    }
  }

  saveSchedules(schedules: ProcessedSchedule[]): void {
    try {
      localStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(schedules));
    } catch (error) {
      console.warn('Failed to save schedules to storage:', error);
    }
  }

  loadConfig(): Partial<AppConfig> {
    try {
      const stored = localStorage.getItem(this.CONFIG_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load config from storage:', error);
      return {};
    }
  }

  saveConfig(config: AppConfig): void {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save config to storage:', error);
    }
  }

  clearAllData(): void {
    try {
      localStorage.removeItem(this.SCHEDULES_KEY);
      localStorage.removeItem(this.CONFIG_KEY);
    } catch (error) {
      console.warn('Failed to clear storage data:', error);
    }
  }
}