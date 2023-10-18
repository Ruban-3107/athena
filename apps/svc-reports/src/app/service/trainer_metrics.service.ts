import axios from 'axios';
import {
  BATCH_PORT, COURSES_PORT, HOST_IP, COURSES_SERVICE_URL,
  BATCHES_SERVICE_URL,
  REPORTS_SERVICE_URL,
  BOT_SERVICE_URL,
  USERS_SERVICE_URL
} from '../config';

let url: string;

class TrainerMetricsService {
  /**top tabs consolidated */
  public trainerTopTabsData = async (trainerId: number) => {
    const tabsData: Array<any> = [];
    tabsData.push(await this.fetchHoursTrained(trainerId));
    tabsData.push(await this.fetchLearnersTrained(trainerId));
    tabsData.push(await this.fetchSchedulesCountThisMonth(trainerId));
    tabsData.push(await this.fetchTopicsCreatedByTrainer(trainerId));

    return tabsData.flat();
  };

  /**trainer total hours trained*/
  private async fetchHoursTrained(trainerId: number): Promise<any> {
    url = `${BATCHES_SERVICE_URL}:${BATCH_PORT}/api/batches/trainermetrics/hoursTrained`;
    try {
      const {
        data: {
          body: {
            value: { hoursTrained },
          },
        },
      } = await axios.get(url, { params: { trainerId: trainerId } });

      return { type: 'Hours trained', value: hoursTrained };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
      } else {
        console.error('An error occurred:', error.message);
      }
      return {
        error:
          error.code === 'ECONNREFUSED'
            ? 'Connection refused, server not running. Using fallback values'
            : error.message,
      };
    }
  }
  /**learners trained under trained...*/
  private async fetchLearnersTrained(trainerId: number): Promise<any> {
    url = `${BATCHES_SERVICE_URL}:${BATCH_PORT}/api/batches/trainermetrics/learnersTrained`;
    try {
      const {
        data: {
          body: {
            value: { learnersTrained },
          },
        },
      } = await axios.get(url, { params: { trainerId: trainerId } });

      return { type: 'Learners trained', value: learnersTrained };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
      } else {
        console.error('An error occurred:', error.message);
      }
      return {
        error:
          error.code === 'ECONNREFUSED'
            ? 'Connection refused, server not running. Using fallback values'
            : error.message,
      };
    }
  }
  /**schedules for trainer this month...*/
  private async fetchSchedulesCountThisMonth(trainerId: number): Promise<any> {
    url = `${BATCHES_SERVICE_URL}:${BATCH_PORT}/api/batches/trainermetrics/trainerSchedules`;
    try {
      const {
        data: {
          body: {
            value: { trainerSchedules },
          },
        },
      } = await axios.get(url, { params: { trainerId: trainerId } });

      return { type: 'Schedules', value: trainerSchedules };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
      } else {
        console.error('An error occurred:', error.message);
      }
      return {
        error:
          error.code === 'ECONNREFUSED'
            ? 'Connection refused, server not running. Using fallback values'
            : error.message,
      };
    }
  }

  /**topics created by trainer*/
  private async fetchTopicsCreatedByTrainer(trainerId: number): Promise<any> {
    url = `${COURSES_SERVICE_URL}:${COURSES_PORT}/api/courses/trainermetrics/topicsCreated`;
    try {
      const {
        data: {
          body: {
            value: { topicsCreated },
          },
        },
      } = await axios.get(url, { params: { trainerId: trainerId } });

      return { type: 'Topics created', value: topicsCreated };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
      } else {
        console.error('An error occurred:', error.message);
      }
      return {
        error:
          error.code === 'ECONNREFUSED'
            ? 'Connection refused, server not running. Using fallback values'
            : error.message,
      };
    }
  }
  /**content analytics trainer*/
  public fetchContentAnalytics = async (trainerId: number, type: string) => {
    url = `${COURSES_SERVICE_URL}:${COURSES_PORT}/api/courses/trainermetrics/contentAnalytics`;
    try {
      const {
        data: {
          body: {
            value: { contentAnalyticsData },
          },
        },
      } = await axios.get(url, { params: { createdBy: trainerId, type } });

      return contentAnalyticsData;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
      } else {
        console.error('An error occurred:', error.message);
      }
      return {
        error:
          error.code === 'ECONNREFUSED'
            ? 'Connection refused, server not running. Using fallback values'
            : error.message,
      };
    }
  };
}
export default TrainerMetricsService;
