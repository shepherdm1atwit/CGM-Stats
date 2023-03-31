import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import Header from "../components/Header";
import Register from "../components/Register";
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";

const AppMain = () => {
    const [message, setMessage] = useState("");
    const {authToken, dexConnect} = useContext(UserContext);
    const [token, setToken] = authToken;
    const [dexConnected, setDexConnected] = dexConnect;

    const getWelcomeMessage = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch("/api/api", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            console.log("something messed up");
        } else {
            setMessage(data.message);
        }
    };

        const checkDexcomToken = async () => {
        const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    };

    useEffect(() => {
        getWelcomeMessage();
    }, []);

    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

   return (
    <>
      <Header title={message} />
      <div className="columns is-centered is-mobile">
        <div className="column m-5 is-8 is-offset-2">
          {!token ? (
            <>
              <div className="buttons">
                <button
                  className={showRegister ? "button is-primary" : "button"}
                  onClick={() => {
                    setShowRegister(true);
                    setShowLogin(false);
                    setShowForgotPassword(false);
                  }}
                >
                  Register
                </button>
                <button
                  className={showLogin ? "button is-primary" : "button"}
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                    setShowForgotPassword(false);
                  }}
                >
                  Login
                </button>
                <button
                  className={
                    showForgotPassword ? "button is-primary" : "button"
                  }
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(false);
                    setShowForgotPassword(true);
                  }}
                >
                  Forgot Password
                </button>
              </div>
              {showRegister && <Register />}
              {showLogin && <Login />}
              {showForgotPassword && <ForgotPassword />}
            </>
          ) : (
            <>
              <a href="https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=http://localhost:8080/VerifyDexcom/&response_type=code&scope=offline_access" className="button is-primary"> Connect to Dexcom </a>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppMain;