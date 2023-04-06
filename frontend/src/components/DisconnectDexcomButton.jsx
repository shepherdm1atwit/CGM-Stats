import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const DisconnectDexcomButton = ({ title }) => {
  const {authToken, dexConnect} = useContext(UserContext);
  const [token, setToken] = authToken;
  const [dexcomConnected, setDexcomConnected] = dexConnect;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const handleDisconnect = async () => {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/disconnectdexcom", requestOptions);
      const data = await response.json();
      if( !response.ok ){
          setErrorMessage(data.detail)
          setSuccessMessage("")
      }
      else{
          setErrorMessage("")
          setDexcomConnected(false)
          setSuccessMessage(data["Status"])
      }
  };

  return (
      <>
          <button className="button is-primary" onClick={handleDisconnect}>
              Disconnect Dexcom Account
          </button>
          <ErrorMessage message={errorMessage} color="red" />
          {successMessage && (
              <div className="notification is-primary">
                  {successMessage}
              </div>
          )}
      </>
  );
};

export default DisconnectDexcomButton;
