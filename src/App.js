import { useContext } from 'react';
import './App.css';

import {
  Navigate,
  HashRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Layout from './Layouts/Layout';
import SearchPage from './Pages/SearchPage';
import HomePage from './Pages/HomePage';

import { CarparkContext } from './Context/CarparkContext';

function App() {
  const { signIn } = useContext(CarparkContext);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/search"
            element={!signIn ? <Navigate to="/" /> : <SearchPage />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
