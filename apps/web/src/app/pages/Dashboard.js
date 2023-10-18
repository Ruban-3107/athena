// import { Signup } from '@athena-v2/web/components'
import {
  apiRequest,
  requireAuth,
  useAuth,
} from '../../../../../libs/web-shared/utils/src';
import {
  ClientRepDashboard,
  DashboardCard,
  LearnerDashboard,
  TrainerDashboard,
} from '../../../../../libs/web-shared/components/src';
import { createContext, useMemo, memo, useEffect, useState } from 'react';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

{
  /* <Chart type='line' data={ChartData} /> */
}

// Create a context and export that bro///

export const LearnerDashContext = createContext();
export const TrainerDashContext = createContext();
export const ClientDashContext = createContext();

export const Dashboard = (props) => {
  const acceptroles = ['Super Admin', 'Job Architect', 'Admin'];
  const learnerroles = ['Learner'];
  const trainerroles = ['Trainer'];
  const clientRepRoles = ['Client Representative'];

  /**Authbro*/
  const auth = useAuth();
  console.log('Auth details', auth?.user?.role?.[0]?.name);
  const userId = Number(auth?.user?.id);
  ///////////////////////////////////////Learner Dashboard ///////////////////////////

  const [learnerDashData, setLearnerDashData] = useState([]);
  const [learnerView, setLearnerView] = useState('week');
  const getContinueLearning = async () => {
    try {
      const {
        value: { userResumeTracks },
      } = await apiRequest(
        `api/reports/learnermetrics/continueLearning?userId=${userId}`,
        `GET`
      );

      setisLoading(true);

      return userResumeTracks;
    } catch (error) {
      console.log('Learner Continue Learning Data error', error);
    }
  };

  const learnerProvider = useMemo(
    () => ({
      learnerView,
      setLearnerView,
    }),
    [learnerView]
  );

  ///////////////////////////////////////Learner Dashboard ///////////////////////////

  return (
    <div
      style={{
        fontFamily: 'Poppins',
      }}
    >
      {acceptroles.includes(auth?.user?.role?.[0]?.name) ? (
        <DashboardCard />
      ) : learnerroles.includes(auth?.user?.role?.[0]?.name) ? (
        <LearnerDashboard />
      ) : trainerroles.includes(auth?.user?.role?.[0]?.name) ? (
        <TrainerDashboard />
      ) : clientRepRoles.includes(auth?.user?.role?.name) ? (
        <ClientRepDashboard />
      ) : null}
    </div>
  );
};

export default requireAuth(Dashboard);
