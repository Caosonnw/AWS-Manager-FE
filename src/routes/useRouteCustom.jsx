import { useRoutes } from 'react-router-dom';
import { path } from '../common/path';

const useRouteCustom = () => {
  const route = useRoutes([
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return route;
};

export default useRouteCustom;
