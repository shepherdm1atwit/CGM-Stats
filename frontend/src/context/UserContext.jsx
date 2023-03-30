import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("CGMStatsToken"));
  const [dexcomConnected, setDexcomConnected] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("/api/me", requestOptions);

      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("CGMStatsToken", token);
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{authToken: [token, setToken],dexConnect: [dexcomConnected, setDexcomConnected]}}>
      {props.children}
    </UserContext.Provider>
  );
};
