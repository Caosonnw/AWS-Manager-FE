import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import HomeTemplate from '../templates/HomeTemplate/HomeTemplate';

const useRouteCustom = () => {
  const route = useRoutes([
    { path: '/', element: <HomeTemplate /> },
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
