import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(
    sessionStorage.getItem("CGMStatsToken"),
    "null"
  );
  const [prefs, setPrefs] = useState({ maximum: null, minimum: null });
  const [dexcomConnected, setDexcomConnected] = useState(false);
  let [sessionExpired, setSessionExpired] = useState(false);
  const value = {
    authToken: [token, setToken],
    userPrefs: [prefs, setPrefs],
    dexConnect: [dexcomConnected, setDexcomConnected],
    sessionExp: [sessionExpired, setSessionExpired],
  };

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      let response;
      let data;
      response = await fetch("/api/me", requestOptions);
      data = await response.json();

      if (!response.ok) {
        if (data.detail === "Your session has expired.") {
          setSessionExpired(true);
        } else setSessionExpired(false);
        setDexcomConnected(false);
        setToken("null");
      } else {
        sessionStorage.setItem("CGMStatsToken", token); // set token in browser
        response = await fetch("/api/dexconnected", requestOptions);
        data = await response.json();
        if (!response.ok) {
          if (data.detail === "Your session has expired.") {
            setSessionExpired(true);
            setToken("null");
          } else {
            setSessionExpired(false);
            setDexcomConnected(false);
          }
        } else {
          setDexcomConnected(data); // set dexcom connected value
          response = await fetch("/api/getpreferences", requestOptions);
          data = await response.json();
          if (!response.ok) {
            if (data.detail === "Your session has expired.") {
              setSessionExpired(true);
            } else {
              setSessionExpired(false);
              setPrefs({ maximum: null, minimum: null });
              setToken("null");
            }
          } else setPrefs({ maximum: data.maximum, minimum: data.minimum }); // set preferences
        }
      }
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
