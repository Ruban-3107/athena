import { NextFunction, Request, Response } from 'express';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import axios from 'axios';

import { MsteamService } from '../config/service/ms-team-service';

class MSTeamsController {
  MsteamService = new MsteamService();

  public scheduleMeeting = async (req: Request, res: Response) => {
    const subject = req.body.subject;
    const attendees = req.body.attendees;

    try {
      const responseCreateEvent = await this.MsteamService.createMeeting(
        subject,
        attendees
      );
      if (responseCreateEvent) {
        const response = responseCF(
          bodyCF({
            val: {
              eventId: responseCreateEvent.data.id,
              meetingLink: responseCreateEvent.data.onlineMeeting.joinUrl,
            },
            message: 'link created successfully!!',
            code: '600',
            status: 'success',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      console.error('Errorrrrrrrrrrrrrrrrrrrr:', error.message);
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '701',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public cancelMeeting = async (req: Request, res: Response) => {
    const eventId = req.body.eventId; // Assuming you have the eventId

    try {
      const responseCancelEvent = await this.MsteamService.cancelMeeting(
        eventId
      );

      if (responseCancelEvent.status === 204) {
        const response = responseCF(
          bodyCF({
            message: 'Meeting canceled successfully!!',
            code: '600',
            status: 'success',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      console.error('Error:', error.message);
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '701',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public rescheduleMeeting = async (req: Request, res: Response) => {
    const eventId = req.body.eventId;
    const newStartDate = req.body.newStartDate;
    const newEndDate = req.body.newEndDate;

    try {
      const responseUpdateEvent = await this.MsteamService.rescheduleMeeting(
        eventId,
        newStartDate,
        newEndDate
      );

      if (responseUpdateEvent.status === 200) {
        const response = responseCF(
          bodyCF({
            message: 'Rescheduled Successfully!!',
            code: '601',
            status: 'success',
            val: {
              eventId: responseUpdateEvent.data.id,
              meetingLink: responseUpdateEvent.data.onlineMeeting.joinUrl,
            },
          })
        );
        return res.json(response);
      }
    } catch (error) {
      console.error('Error:', error.message);
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '701',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };
}

export default MSTeamsController;
