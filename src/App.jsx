import useRouteCustom from './routes/useRouteCustom';
import AOSProvider from './utils/AOSProvider.jsx';

function App() {
  const myRoutes = useRouteCustom();
  return <AOSProvider>{myRoutes}</AOSProvider>;
}

export default App;
