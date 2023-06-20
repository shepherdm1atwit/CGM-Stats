import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const DisconnectDexcomButton = ({ title }) => {
  const { authToken, dexConnect } = useContext(UserContext);
  const [token,] = authToken;
  const [, setDexcomConnected] = dexConnect;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //...

  return (
    <>
      <Button variant="primary" onClick={handleDisconnect}>
        Disconnect Dexcom Account
      </Button>
      <ErrorMessage message={errorMessage} color="red" />
      {successMessage && (
        <Alert variant="primary">
          {successMessage}
        </Alert>
      )}
    </>
  );
};

export default DisconnectDexcomButton;
