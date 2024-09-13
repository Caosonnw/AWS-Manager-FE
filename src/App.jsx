import useRouteCustom from './routes/useRouteCustom';
import AOSProvider from './utils/AOSProvider.jsx';
import { AlertProvider, useAlert } from './utils/AlertContext/AlertContext.jsx';

function App() {
  const myRoutes = useRouteCustom();
  return (
    <AOSProvider>
      <AlertProvider>{myRoutes}</AlertProvider>
    </AOSProvider>
  );
}

export default App;
