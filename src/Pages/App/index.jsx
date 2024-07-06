import { useRoutes, BrowserRouter } from 'react-router-dom';
import { ChessBoardProvider } from '../../Context';
import ChessGame from '../ChessGame';
import Login from '../Login';
import Register from '../Register';
import Profile from '../Profile';
import NotFound from '../NotFound';
import Navbar from '../../Components/Navbar';
import './App.css';

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <ChessGame /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/profile', element: <Profile /> },
    { path: '/*', element: <NotFound /> },
  ]);

  return routes;
};

function App() {
  return (
    <ChessBoardProvider>
      <BrowserRouter>
        <AppRoutes />
        <Navbar />
      </BrowserRouter>
    </ChessBoardProvider>
  );
}

export default App;
