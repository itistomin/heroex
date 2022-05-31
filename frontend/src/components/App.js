import React, { useContext, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import AuthLandingPage from "./AuthLanginPage";
import Header from "./Header";
import Navigation from './Navigation';
import Market from './Market';
import Portfolio from "./Portfolio";
import MatchPoints from './MatchPoints';
import '../styles/body.css';


const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [searchBy, setSearchBy] = useState('');
  const location = useLocation();

  return (
    <div className="container">
      <Header {...{setSearchBy}} />
      <Navigation />
      {!isAuthenticated && <AuthLandingPage />}
      <Routes>
          <Route path="/" element={<Navigate to='/market' />} />
          <Route path="/market" element={<Market {...{searchBy}} />} />
          <Route path="/points" element={<MatchPoints {...{searchBy}} />} />
          <Route path="/portfolio" element={<Portfolio {...{searchBy}} />} />
      </Routes>
    </div>
  );
}

export default App;
