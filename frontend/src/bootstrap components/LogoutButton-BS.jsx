import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";
import Button from "react-bootstrap/Button";

const LogoutButton = () => {
  const { authToken } = useContext(UserContext);
  const [, setToken] = authToken;

  const handleLogout = () => {
    setToken("null");
    sessionStorage.setItem("CGMStatsToken", null);
  };

  return (
    <Button variant="danger" className="button" onClick={handleLogout}>
      Logout of CGM Stats
    </Button>
  );
};

export default LogoutButton;
