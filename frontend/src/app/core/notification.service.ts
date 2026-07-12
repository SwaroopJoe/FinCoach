import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { UserProfile } from '../models/finance.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly ids = [4101, 4102, 4103, 4104, 4105, 4106];

  async scheduleProfileReminders(profile: UserProfile): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    const times = profile.notificationTimes
      .map((time) => this.parseTime(time))
      .filter((time): time is { hour: number; minute: number } => Boolean(time))
      .slice(0, this.ids.length);

    if (times.length === 0) {
      await this.cancelProfileReminders();
      return false;
    }

    const permission = await LocalNotifications.requestPermissions();

    if (permission.display !== 'granted') {
      return false;
    }

    await this.cancelProfileReminders();
    await LocalNotifications.schedule({
      notifications: times.map((time, index) => this.createReminder(profile, time.hour, time.minute, this.ids[index]))
    });

    return true;
  }

  async cancelProfileReminders(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await LocalNotifications.cancel({ notifications: this.ids.map((id) => ({ id })) });
  }

  private createReminder(profile: UserProfile, hour: number, minute: number, id: number): LocalNotificationSchema {
    return {
      id,
      title: 'Financial Coach reminder',
      body: `${profile.name}, review today's plan and update any spending changes.`,
      schedule: {
        on: { hour, minute },
        repeats: true
      },
      smallIcon: 'ic_stat_icon_config_sample',
      sound: 'default'
    };
  }

  private parseTime(value: string): { hour: number; minute: number } | null {
    const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);

    if (!match) {
      return null;
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    return { hour, minute };
  }
}
