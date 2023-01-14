import { useContext } from 'react';
import './App.css';

import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import SearchPage from './Pages/SearchPage';
import HomePage from './Pages/HomePage';

import { CarparkContext } from './Context/CarparkContext';

function App() {
  const { signIn } = useContext(CarparkContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/search"
          element={!signIn ? <Navigate to="/" /> : <SearchPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
