import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";
import LogoutButton from "./LogoutButton";

const Header = ({ title }) => {
  const {authToken, } = useContext(UserContext);
  const [token, setToken] = authToken;


  return (
    <div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      {token && <LogoutButton />}
    </div>
  );
};

export default Header;
