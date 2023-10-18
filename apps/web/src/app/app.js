import './app.css';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import FullCalenderPage from './pages/FullCalenderPage';
import { AppLayout, AuthLayout } from '@athena/web-shared/ui';
import { Home, ManageAssessment } from '@athena/web-shared/components';
import { AuthProvider, Router, Routes, Route } from '@athena/web-shared/utils';
import ManageTopics from './pages/ManageTopics';
import ManageChaptersPage from './pages/ManageChaptersPage';
import ManageCoursesPage from './pages/ManageCoursesPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageTrack from './pages/ManageTrack';
import ManageExercisesPage from './pages/ManageExercisesPage';
import AddAndEditUser from './pages/AddAndEditUser';
import BrowseCoursesPage from './pages/BrowseCoursesPage';
import AuthPage from './pages/Auth';
import ChatGPTPage from './pages/ChatGPTPage';
import CreateBatchPage from './pages/CreateBatchPage';
import CreateChapterPage from './pages/CreateChapterPage';
import CreateCorporatePage from './pages/CreateCorporatePage';
import CreateTopicPage from './pages/CreateTopicPage';
import CreateRolePage from './pages/CreateRolePage';
import CreateCoursePage from './pages/CreateCoursePage';
import CreateTrackPage from './pages/CreateTrackPage';
import CreateExercisePage from './pages/CreateExercisePage';
import ManageBatchesPage from './pages/ManageBatchesPage';
import SettingPage from './pages/SettingPage';
import ActivityLogPage from './pages/ActivityLogPage';
import ManageCorporatePage from './pages/ManageCorporatePage';
import TrainerCalenderPage from './pages/TrainerCalenderPage';
import CourseBriefPage from './pages/CourseBriefPage';
import ConfigurePage from './pages/ConfigurePage';
import CreateAssessmentPage from './pages/CreateAssessmentPage';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

// Initialize Google Analytics with your Tracking ID
ReactGA.initialize('G-9SG0NMKC6S'); // Replace with your Tracking ID



// RouteTracker component to track pageviews
const RouteTracker = () => {
  const { pathname, search } = window.location;
  ReactGA.pageview(pathname + search);
  return null;
};

export function App() {
  // Send initial pageview
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search, title: "Home Page" })
  }, [])

  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        closeButton={false}
        draggable={false}
        autoClose={1000}
        hideProgressBar
        theme="light"
      />
      <Router>
        <Routes>
          <Route component={RouteTracker} >
            <Route path="/" element={<AuthLayout app="admin-app" />}>
              <Route index element={<Home />} />
              <Route path="auth/:type" element={<AuthPage />} />
            </Route>
            <Route path="/app" element={<AppLayout />}>
              <Route path="/app/dashboard" element={<Dashboard />} />
              <Route path="/app/adduser" element={<AddAndEditUser />} />
              <Route path="/app/adduser/:id" element={<AddAndEditUser />} />
              <Route path="/app/browse" element={<BrowseCoursesPage />} />
              <Route path="/app/browse/:id" element={<CourseBriefPage />} />
              <Route path="/app/browse/:id/course/:courseId" element={<CourseBriefPage />} />
              <Route path="/app/managetopics" element={<ManageTopics />} />
              <Route path="/app/managebatches" element={<ManageBatchesPage />} />
              <Route path="/app/managechapter" element={<ManageChaptersPage />} />
              <Route path="/app/managecourse" element={<ManageCoursesPage />} />
              <Route path="/app/manageuser" element={<ManageUsersPage />} />
              <Route path="/app/managetrack" element={<ManageTrack />} />
              <Route path="/app/createbatch" element={<CreateBatchPage />} />
              <Route path="/app/editbatch" element={<CreateBatchPage />} />
              <Route path="/app/createchapter" element={<CreateChapterPage />} />
              <Route path="/app/manageassessment" element={<ManageAssessment />} />

              <Route
                path="/app/createchapter/:id"
                element={<CreateChapterPage />}
              />
              <Route
                path="/app/createcorporate"
                element={<CreateCorporatePage />}
              />
              <Route
                path="/app/createcorporate/:id"
                element={<CreateCorporatePage />}
              />
              <Route path="/app/createtopics" element={<CreateTopicPage />} />
              <Route path="/app/createtopics/:id" element={<CreateTopicPage />} />
              <Route path="/app/createrole/:type" element={<CreateRolePage />} />
              <Route path="/app/createcourse" element={<CreateCoursePage />} />
              <Route path="/app/createassessment" element={<CreateAssessmentPage />} />
              <Route
                path="/app/createcourse/:id"
                element={<CreateCoursePage />}
              />
              <Route path="/app/createtrack" element={<CreateTrackPage />} />
              <Route path="/app/createtrack/:id" element={<CreateTrackPage />} />
              <Route
                path="/app/createtrack/:id/course/:courseId"
                element={<CreateTrackPage />}
              />
              <Route path="/app/manageexercises" element={<ManageExercisesPage />} />
              <Route path="/app/createexercise" element={<CreateExercisePage />} />
              <Route path="/app/chatGPT" element={<ChatGPTPage />} />
              <Route path="/app/setting" element={<SettingPage />} />
              <Route path="/app/activity" element={<ActivityLogPage />} />
              <Route
                path="/app/managecorporate"
                element={<ManageCorporatePage />}
              />
              <Route path="/app/calendar" element={<FullCalenderPage />} />
              <Route path="/app/mycalendar" element={<TrainerCalenderPage />} />
              <Route path="/app/configure" element={<ConfigurePage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
