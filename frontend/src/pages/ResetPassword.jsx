import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import Header from "../components/Header";
import Register from "../components/Register";
import Login from "../components/Login";
import ForgotPassword from "../components/ForgotPassword";

const ResetPassword = () => {
    const [message, setMessage] = useState("");
    const [token] = useContext(UserContext);

   return (
    <>
      <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
         </div>
        <div className="column"></div>
      </div>
    </>
  );
};

export default ResetPassword;