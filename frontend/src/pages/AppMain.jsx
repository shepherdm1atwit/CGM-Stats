import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import Header from "../components/Header";
import UserManage from "../components/UserManage";

const AppMain = () => {
    const [message, setMessage] = useState("");
    const {authToken, dexConnect} = useContext(UserContext);
    const [token, setToken] = authToken;
    const [dexcomConnected, setDexcomConnected] = dexConnect;

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
            setMessage("Oops, something messed up, no backend connection.");
        } else {
            setMessage(data.message);
        }
    };

    useEffect(() => {
        getWelcomeMessage();
    }, []);

    function printToken(){
        console.log(token)
    }

   return (
    <>
      <Header title={message} />
        <button className="button" type="button" onClick={printToken}>
          print token
        </button>
      <div className="columns is-centered is-mobile">
        <div className="column m-5 is-8 is-offset-2">
          {!token ? (
            <UserManage />
          ) : (
              <div className="has-text-centered">
                {!dexcomConnected
                  ? (<a href="https://sandbox-api.dexcom.com/v2/oauth2/login?client_id=FzbQyNRMDTm8xdRrcR2STg8I7S781RC0&redirect_uri=http://localhost:8080/VerifyDexcom/&response_type=code&scope=offline_access" className="button is-primary"> Connect to Dexcom </a>)
                  : (<p>LOOK, NO BUTTON!</p>)
                }
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppMain;