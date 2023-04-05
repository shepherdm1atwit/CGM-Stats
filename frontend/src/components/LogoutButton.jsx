import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";

const LogoutButton = ({ title }) => {
  const {authToken, } = useContext(UserContext);
  const [, setToken] = authToken;


  const handleLogout = () => {
    console.log(token)
    setToken(null);
    console.log(token)
  };

  return (
    <button className="button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
