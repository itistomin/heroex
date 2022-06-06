import React, { useContext, useState, useEffect } from "react";
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
  const { isAuthenticated, apiInstance } = useContext(AuthContext);
  const [searchBy, setSearchBy] = useState('');
  const [index, updateIndex] = useState(0)
  
  const setIndex = () => {
      apiInstance.get('/api/stock/weekindex/').then((response) => updateIndex(response.data))
  }
  useEffect(setIndex, [isAuthenticated]);

  return (
    <div className="container">
      <Header {...{setSearchBy, index}} />
      <Navigation />
      {!isAuthenticated && <AuthLandingPage />}
      <Routes>
          <Route path="/" element={<Navigate to='/market' />} />
          <Route path="/market" element={<Market {...{searchBy, updateIndex}} />} />
          <Route path="/points" element={<MatchPoints {...{searchBy, updateIndex}} />} />
          <Route path="/portfolio" element={<Portfolio {...{searchBy, updateIndex}} />} />
      </Routes>
    </div>
  );
}

export default App;
