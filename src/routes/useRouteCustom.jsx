import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import HomeTemplate from '../templates/HomeTemplate/HomeTemplate';
import TaskManager from '../pages/TaskManager/TaskManager';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import Dashboard from '../pages/Dashboard/Dashboard';
import TimeKeeping from '../pages/TimeKeeping/TimeKeeping';

const useRouteCustom = () => {
  const route = useRoutes([
    {
      path: '/',
      element: <HomeTemplate />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: path.taskManager,
          element: <TaskManager />,
        },
        {
          path: path.profile,
          element: <ProfilePage />,
        },
        {
          path: path.timekeeping,
          element: <TimeKeeping />,
        },
      ],
    },

    { path: path.login, element: <LoginPage /> },
    { path: path.signup, element: <SignUpPage /> },
    // {
    //   path: '*',
    //   element: <NotFound />,
    // },
  ]);
  return route;
};

export default useRouteCustom;
