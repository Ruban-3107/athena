/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { NOTIFICATION_SERVICE_PORT } from './app/config';
import { logger } from './app/utils/logger';
import { MessageQueue } from './app/utils/message.queue';
import { SchedulerJob } from './app/config/scheduler';

const app = express();

app.get('/api/notification', (req, res) => {
  res.send({ message: 'Welcome to svc-notification!' });
});

const port = NOTIFICATION_SERVICE_PORT || 3333;
const server = app.listen(port, async () => {
  logger.info(`Notification service listening at Port:${port}`);
  const messageQueue = new MessageQueue();
  await messageQueue.publisher(); //connecting to Redis
  await messageQueue.subscriber();
  const alertNotification = new SchedulerJob();
  alertNotification.alert(); //call the cron
});
server.on('error', console.error);
