/**
 * @file UserContext.jsx
 * @brief Context provider for managing user-related states.
 */
import React, {createContext, useEffect, useState} from "react";

export const UserContext = createContext();

/**
 * @function UserProvider
 * @brief Context provider component to share user information.
 *
 * This provider component manages the user's authentication token, preferences,
 * Dexcom connection status, and session expiration status. It makes asynchronous
 * requests to fetch and update these values from the server.
 *
 * @param props - The children components that have access to this context.
 * @return The UserContext.Provider JSX element to wrap the children components.
 */
export const UserProvider = (props) => {
    const [token, setToken] = useState(
        sessionStorage.getItem("CGMStatsToken"),
        "null"
    );//!< State variables for authentication token
    const [prefs, setPrefs] = useState({maximum: null, minimum: null});//!< State variables for user preferences
    const [dexcomConnected, setDexcomConnected] = useState(false); //!< State variable for Dexcom connection status
    let [sessionExpired, setSessionExpired] = useState(false); //!< State variable for session expiration status
    const value = {
        authToken: [token, setToken],
        userPrefs: [prefs, setPrefs],
        dexConnect: [dexcomConnected, setDexcomConnected],
        sessionExp: [sessionExpired, setSessionExpired],
    };

    /**
     * @brief useEffect hook to fetch user information when the token changes.
     *
     * This hook triggers an asynchronous function to fetch the user's information,
     * including the authentication token, preferences, Dexcom connection status,
     * and session expiration status from the server whenever the token changes.
     */
    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                // Perform multiple fetch requests to get user-related details
                // and update the state accordingly
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
                            setPrefs({maximum: null, minimum: null});
                            setToken("null");
                        }
                    } else setPrefs({maximum: data.maximum, minimum: data.minimum}); // set preferences
                }
            }
        };
        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
    );
};
