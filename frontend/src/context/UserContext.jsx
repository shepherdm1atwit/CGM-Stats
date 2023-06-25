import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(sessionStorage.getItem("CGMStatsToken"));
  const [dexcomConnected, setDexcomConnected] = useState("");
  let [sessionExpired, setSessionExpired] = useState(false);
  const value = {authToken: [token, setToken],dexConnect: [dexcomConnected, setDexcomConnected], sessionExp: [sessionExpired, setSessionExpired]}

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
      const data = await response.json()

      if (!response.ok) {
        if (data.detail==="Your session has expired."){
          setSessionExpired(true);
        }
        setSessionExpired(false);
        setDexcomConnected(false);
        setToken(null);
      }
      else {
        sessionStorage.setItem("CGMStatsToken", token);
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };

        const response = await fetch("/api/dexconnected", requestOptions);
        const data = await response.json()
        setDexcomConnected(data);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
};
