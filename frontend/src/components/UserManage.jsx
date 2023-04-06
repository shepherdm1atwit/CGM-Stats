import React, {useState} from "react";
import Register from "../components/Register";
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";

const UserManage = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);


   return (
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
  );
};

export default UserManage;