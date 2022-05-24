import React, { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
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
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <AuthLandingPage />
  }

  return (
    <div className="container">
      <Header />
      <Navigation />
      <Routes>
          <Route path="/" element={<Navigate to='/market' />} />
          <Route path="/market" element={<Market />} />
          <Route path="/points" element={<MatchPoints />} />
          <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </div>
  );
}

export default App;
