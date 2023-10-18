import DB from '../database/index';
import { NotificationsPreferences } from '../interface/notification_preference.interface';

class NotificationPreferenceService {
  public notificationPreference = DB.DBmodels.notifications_preferences;

  public async findAllNotificationPreference(
    userRole
  ): Promise<NotificationsPreferences[]> {
    console.log(userRole, '---userRole---');
    const names = userRole.map((obj) => obj.name);
    if (names.includes('Super Admin')) {
      const allNotificationPreference: NotificationsPreferences[] =
        await this.notificationPreference.findAll();
      return allNotificationPreference;
    } else {
      const allNotificationPreference: NotificationsPreferences[] =
        await this.notificationPreference.findAll({ where: { status: true } });
      return allNotificationPreference;
    }
  }

  public async updateNotificationPreference(
    notificationPreferenceEnableId: number,
    notificationPreferenceDisableId: number
  ): Promise<NotificationsPreferences> {
    console.log(
      'notificationPreferenceEnableId==>',
      notificationPreferenceEnableId,
      'notificationPreferenceDisableId==>',
      notificationPreferenceDisableId
    );

    if (notificationPreferenceEnableId) {
      const findNotificationEnablePreference: NotificationsPreferences =
        await this.notificationPreference.findOne({
          where: { id: notificationPreferenceEnableId },
        });
      await this.notificationPreference.update(
        { status: true },
        { where: { id: findNotificationEnablePreference.id } }
      );
      return findNotificationEnablePreference;
    }
    if (notificationPreferenceDisableId) {
      const findNotificationDisablePreference: NotificationsPreferences =
        await this.notificationPreference.findOne({
          where: { id: notificationPreferenceDisableId },
        });
      await this.notificationPreference.update(
        { status: false },
        { where: { id: findNotificationDisablePreference.id } }
      );
      return findNotificationDisablePreference;
    }
  }
}

export default NotificationPreferenceService;
