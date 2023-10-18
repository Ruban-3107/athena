import { HttpException } from '@athena/shared/exceptions';
import axios from 'axios';
import {
  MS_CLIENT_ID,
  MS_GRANT_TYPE,
  MS_CLIENT_SECRET,
  MS_USERNAME,
  MS_SCOPE,
  MS_PASSWORD,
  MS_TIMEZONE,
} from '../../config/index';

export class MsteamService {
  public params;
  constructor() {
    this.initialParams();
  }

  public async initialParams() {
    this.params = new URLSearchParams();
    this.params.append('client_id', MS_CLIENT_ID);
    this.params.append('grant_type', MS_GRANT_TYPE);
    this.params.append('client_secret', MS_CLIENT_SECRET);
    this.params.append('username', MS_USERNAME);
    this.params.append('scope', MS_SCOPE);
    this.params.append('password', MS_PASSWORD);
  }

  public async createMeeting(subject: any, attendees: any[]): Promise<any> {
    try {
      const arrayOfAttendees = attendees.map((data) => {
        return {
          emailAddress: {
            address: data.email,
            name: data.name,
          },
          type: 'required',
        };
      });
      const config = await this.configData();

      const obj = {
        subject: subject,
        body: {
          contentType: 'HTML',
        },
        start: {
          dateTime: attendees[0].ms_start_date,
          timeZone: MS_TIMEZONE,
        },
        end: {
          dateTime: attendees[0].ms_end_date,
          timeZone: MS_TIMEZONE,
        },
        attendees: arrayOfAttendees,
        allowNewTimeProposals: true,
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness',
      };

      const responseCreateEvent = await axios.post(
        'https://graph.microsoft.com/v1.0/me/events',
        obj,
        config
      );
      if (responseCreateEvent.data.id) {
        return responseCreateEvent;
      }
    } catch (error) {
      throw new HttpException(401, error);
    }
  }

  public async configData() {
    try {
      const response = await axios.post(
        'https://login.microsoftonline.com/6a5d9977-ef95-4a39-b842-b8443c09dfbf/oauth2/v2.0/token',
        this.params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      const accessToken = response.data.access_token;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };
      return config;
    } catch (error) {
      throw new HttpException(401, error);
    }
  }

  public async cancelMeeting(eventId: any) {
    try {
      const getConfig = await this.configData();

      const responseCancelEvent = await axios.delete(
        `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
        getConfig
      );
      return responseCancelEvent;
    } catch (error) {
      throw new HttpException(401, error);
    }
  }

  public async rescheduleMeeting(eventId, newStartDate, newEndDate) {
    try {
      const config = await this.configData();

      const obj = {
        start: {
          dateTime: newStartDate,
          timeZone: MS_TIMEZONE,
        },
        end: {
          dateTime: newEndDate,
          timeZone: MS_TIMEZONE,
        },
      };

      const responseUpdateEvent = await axios.patch(
        `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
        obj,
        config
      );

      return responseUpdateEvent;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}
