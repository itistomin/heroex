import React, { useContext } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import AuthLandingPage from "./AuthLanginPage";
import Header from "./Header";
import '../styles/body.css';


const App = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <AuthLandingPage />
  }

  return (
    <div className="container">
      <Header />
    </div>
  );
}

export default App;
