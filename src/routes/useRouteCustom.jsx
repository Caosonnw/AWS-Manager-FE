import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import HomeTemplate from '../templates/HomeTemplate/HomeTemplate';
import TaskManager from '../pages/TaskManager/TaskManager';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import Dashboard from '../pages/Dashboard/Dashboard';
import TimeKeeping from '../pages/TimeKeeping/TimeKeeping';
import ListManager from '../layout/ListManager/ListManager';
import ChatPage from '../pages/ChatPage/ChatPage';
import Logout from '../pages/LogoutPage/Logout';
import NotFoundAnimation from '../components/Animations/NotFoundAnimation';
import UserManagement from '../pages/UserManagement/UserManagement';
import SocialNetwork from '../pages/SocialNetwork/SocialNetwork';

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
          element: <ListManager />,
        },
        {
          path: path.profile,
          element: <ProfilePage />,
        },
        {
          path: path.timekeeping,
          element: <TimeKeeping />,
        },
        {
          path: path.chat,
          element: <ChatPage />,
        },
        {
          path: path.logout,
          element: <Logout />,
        },
        {
          path: path.project,
          element: <TaskManager />,
        },
        {
          path: path.userManagement,
          element: <UserManagement />,
        },
        {
          path: path.socialNetwork,
          element: <SocialNetwork />,
        },
      ],
    },

    { path: path.login, element: <LoginPage /> },
    { path: path.signup, element: <SignUpPage /> },
    {
      path: '*',
      element: <NotFoundAnimation />,
    },
  ]);
  return route;
};

export default useRouteCustom;
