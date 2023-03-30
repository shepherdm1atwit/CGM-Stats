import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";

const Header = ({ title }) => {
  const {authToken, dexConnect} = useContext(UserContext);
    const [token, setToken] = authToken;
    const [dexConnected, setDexConnected] = dexConnect;


  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      {token && (
        <button className="button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
