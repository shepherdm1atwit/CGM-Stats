import React, { useContext } from "react";
import Button from 'react-bootstrap/Button';

import { UserContext } from "../context/UserContext";

const LogoutButton = ({ title }) => {
  const { authToken, } = useContext(UserContext);
  const [token, setToken] = authToken;

  const handleLogout = () => {
    setToken(null);
    sessionStorage.setItem("CGMStatsToken", null);
  };

  return (
    <Button variant="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
