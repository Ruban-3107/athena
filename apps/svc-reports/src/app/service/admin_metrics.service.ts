import dotenv from 'dotenv';
import {
  BATCHES_SERVICE_PORT, COURSES_SERVICE_PORT, HOST_IP, USERS_SERVICE_PORT, COURSES_SERVICE_URL,
  BATCHES_SERVICE_URL,USERS_SERVICE_URL
} from '../config';
import axios from 'axios';
import {
  PerformanceChart,
  NeedAttention,
} from '../interface/admin_metrics.interface';

dotenv.config();
class AdminMetricsService {
  ////////////////////////////////Top tabs data///////////////////////////////
  /**top tabs data consolidated*/
  public adminTopTabsData = async () => {
    const tabsData: Array<any> = [];
    console.log("here:came")
    tabsData.push(await this.fetchTotalUsersCount());
    tabsData.push(await this.fetchTotalBatchesCount());
    tabsData.push(await this.fetchTotalCoursesCount());
    tabsData.push(await this.fetchTotalPendingApprovalCount());
    return tabsData.flat();
  };
  /**Total users count*/
  private async fetchTotalUsersCount(): Promise<any> {
    console.log("FFFFFF:",`${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/api/users/adminMetrics/userCount`)
    try {
      const {
        data: {
          body: {
            value: { usersCount },
          },
        },
      } = await axios({
        url: `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/api/users/adminMetrics/userCount`,
        method: 'GET',
      });

      return usersCount;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );

        return {
          type: 'Total Users',
          count: '1000',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          type: 'Total Users',
          count: '1000',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  /**Total batches count*/
  private async fetchTotalBatchesCount(): Promise<any> {
    try {
      const {
        data: {
          body: {
            value: { batchesCount },
          },
        },
      } = await axios({
        url: `${BATCHES_SERVICE_URL}:${BATCHES_SERVICE_PORT}/api/batches/adminMetrics/batchCount`,
        method: 'GET',
      });
      console.log('YAAAAAAA', batchesCount);

      return batchesCount;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          type: 'Batches',
          count: '1000',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          type: 'Batches',
          count: '1000',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  /**Total courses count*/
  private async fetchTotalCoursesCount(): Promise<any> {
    try {
      const {
        data: {
          body: {
            value: { coursesCount },
          },
        },
      } = await axios({
        url: `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/api/courses/adminMetrics/courseCount`,
        method: 'GET',
      });
      return coursesCount;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          type: 'Courses',
          count: '1000',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          type: 'Courses',
          count: '1000',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  /**Total pending approval count*/
  private async fetchTotalPendingApprovalCount(): Promise<any> {
    try {
      const {
        data: {
          body: {
            value: { pendingApprovalCoursesCount },
          },
        },
      } = await axios({
        url: `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/api/courses/adminMetrics/pendingApprovalCoursesCount`,
        method: 'GET',
      });
      return pendingApprovalCoursesCount;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          type: 'Pending Approval',
          count: '1000',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          type: 'Pending Approval',
          count: '1000',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  ////////////////////////////////Top tabs data///////////////////////////////

  ////////////////////////////////Need Attention data///////////////////////////////
  /**When admin hasnt overseen some details
   * e.g didnt approve course/topic/track/chapter for mrore than 3 days,
   * or if user that has'nt been approved for more than 3 days,
   *  they will be shown as a notification here*/
  public fetchNeedAttentionData = async (limit = 5) => {
    const adminNeedAttention: Array<NeedAttention> = [];

    adminNeedAttention.push(await this.fetchCoursesNeedAttentionData(limit));
    adminNeedAttention.push(await this.fetchUsersNeedAttentionData(limit));

    //all need attention data will be in ascending order of timestamps
    return adminNeedAttention.flat().sort((a, b) => a.createdAt - b.createdAt);
  };

  /**Courses need attention */
  private async fetchCoursesNeedAttentionData(limit = 5): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { needAttentionCourses },
          },
        },
      } = await axios({
        url: `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/api/courses/adminMetrics/needAttentionCourses?limit=${limit}`,
        method: 'GET',
      });

      //if (needAttentionCourses.length === 0) return { empty: true };
      return needAttentionCourses;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          title: 'Sample course/track/topic',
          createdAt: new Date(),
          needAttentionSubtitle: 'Sample course/track/topic needs approval',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          title: 'Sample course/track/topic',
          createdAt: new Date(),
          needAttentionSubtitle: 'Sample course/track/topic needs approval',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  /**Users need attention */
  private async fetchUsersNeedAttentionData(limit = 5): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { needAttentionUsers },
          },
        },
      } = await axios({
        url: `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/api/users/adminMetrics/needAttentionUsers?limit=${limit}`,
        method: 'GET',
      });

      //if (needAttentionUsers.length === 0) return { empty: true };
      return needAttentionUsers;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          title: 'Sample user',
          createdAt: new Date(),
          needAttentionSubtitle: 'Sample user needs approval',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          title: 'Sample user',
          createdAt: new Date(),
          needAttentionSubtitle: 'Sample user needs approval',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }

  ////////////////////////////////Need Attention data///////////////////////////////
  ////////////////////////////////Recent activities data///////////////////////////////
  public fetchRecentActivitiesData = async (limit = 5) => {
    const adminRecentActivities: object[] = [];
    adminRecentActivities.push(await this.fetchUsersRecentActivities(limit));
    adminRecentActivities.push(await this.fetchBatchesRecentActivities(limit));
    return adminRecentActivities.flat();
  };

  /**Users recent activities*/
  private async fetchUsersRecentActivities(limit = 5): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { usersRecentActivities },
          },
        },
      } = await axios.get(
        `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/api/users/adminMetrics/usersRecentActivities`,
        { params: { limit } }
      );

      //if (needAttentionUsers.length === 0) return { empty: true };
      return usersRecentActivities;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          title: 'New user',
          createdAt: new Date(),
          recentActivitySubtitle: `New sample user registered under email 'sample@gmail.com' at 04 Jul 2023`,
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          title: 'New user',
          createdAt: new Date(),
          recentActivitySubtitle: `New sample user registered under email 'sample@gmail.com' at 04 Jul 2023`,
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  /**Batches recent activities*/
  private async fetchBatchesRecentActivities(limit = 5): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { batchesRecentActivities },
          },
        },
      } = await axios.get(
        `${BATCHES_SERVICE_URL}:${BATCHES_SERVICE_PORT}/api/batches/adminMetrics/batchesRecentActivities`,
        { params: { limit } }
      );

      return batchesRecentActivities;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          title: 'New Batche commenced',
          createdAt: new Date(),
          recentActivitySubtitle: `New Batch commenced at 5:00 AM`,
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          title: 'New user',
          createdAt: new Date(),
          recentActivitySubtitle: `New Batch commenced at 5:00 AM`,
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }

  ////////////////////////////////Recent activities data///////////////////////////////

  ////////////////////////////////Graph data///////////////////////////////
  /**To show graph data*/
  public fetchPerformanceChartData = async (dateRange = 'week') => {
    const finalChart: PerformanceChart[] = [];
    finalChart.push(await this.fetchCoursesGraphData(dateRange));
    finalChart.push(await this.fetchUsersGraphData(dateRange));
    return finalChart.flat() as PerformanceChart;
  };
  /**Users graph data */
  private async fetchUsersGraphData(dateRange = 'week'): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { usersGraphData },
          },
        },
      } = await axios({
        url: `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/api/users/adminMetrics/userGraph?view=${dateRange}`,
        method: 'GET',
      });

      return usersGraphData;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          graphLabel: 'Jan',
          type: 'users_data',
          count: '0',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          graphLabel: 'Jan',
          type: 'users_data',
          count: '0',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }

  /**Courses graph data */
  private async fetchCoursesGraphData(dateRange = 'week'): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { coursesGraphData },
          },
        },
      } = await axios({
        url: `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/api/courses/adminMetrics/courseGraph?view=${dateRange}`,
        method: 'GET',
      });
      return coursesGraphData;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          graphLabel: 'Jan',
          type: 'courses_data',
          count: '0',
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          graphLabel: 'Jan',
          type: 'courses_data',
          count: '0',
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  ////////////////////////////////Graph data///////////////////////////////

  ///////////////////////////////Pie Chart Data//////////////////////////

  public fetchAdminPieChartData = async (dateRange = 'week') => {
    const pieChartData: any[] = [];

    pieChartData.push(await this.fetchBatchesPieChartData(dateRange));
    pieChartData.push(await this.fetchCoursesPieChartData(dateRange));

    return pieChartData.flat();
  };

  /**Courses Pie Chart*/
  private async fetchCoursesPieChartData(dateRange = 'week'): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { tracksGroupedData },
          },
        },
      } = await axios.get(
        `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/api/courses/adminMetrics/pieChart`,
        { params: { dateRange } }
      );
      return tracksGroupedData;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  /**batches Pie Chart*/
  private async fetchBatchesPieChartData(dateRange = 'week'): Promise<any> {
    try {
      const {
        data: {
          body: {
            code,
            value: { batchesGroupedData },
          },
        },
      } = await axios.get(
        `${BATCHES_SERVICE_URL}:${BATCHES_SERVICE_PORT}/api/batches/adminmetrics/pieChart`,
        { params: { dateRange } }
      );
      return batchesGroupedData;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
        return {
          error:
            'Connection refused, server not running. Using fallback values',
        };
      } else {
        console.error('An error occurred:', error.message);
        return {
          error: error.message + `, Using fallback values`,
        };
      }
    }
  }
  ///////////////////////////////Pie Chart Data//////////////////////////
}
export default AdminMetricsService;
