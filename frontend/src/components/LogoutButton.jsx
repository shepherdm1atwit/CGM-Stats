import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";

const LogoutButton = ({ title }) => {
  const {authToken, } = useContext(UserContext);
  const [token, setToken] = authToken;


  const handleLogout = () => {
    setToken(null);
    sessionStorage.setItem("CGMStatsToken", null);
  };

  return (
    <button className="button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
