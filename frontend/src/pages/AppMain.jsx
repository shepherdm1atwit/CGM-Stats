import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import Header from "../components/Header";
import Register from "../components/Register";
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";

const AppMain = () => {
    const [message, setMessage] = useState("");
    const [token] = useContext(UserContext);

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

    useEffect(() => {
        getWelcomeMessage();
    }, []);

    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

   return (
    <>
      <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
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
            <p> Hello there </p>
          )}
        </div>
        <div className="column"></div>
      </div>
    </>
  );
};

export default AppMain;