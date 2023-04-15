import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/UserContext";
import errorMessage from "./ErrorMessage";
import ErrorMessage from "./ErrorMessage";

const CurrentGlucoseLevel = () => {
  const {authToken,} = useContext(UserContext);
  const [token,] = authToken;
  const [currentGlucose, setCurrentGlucose] = useState("");

  useEffect(() => {
    const getCurrentGlucose = async () => {
      const requestOptions = {
        method: "GET",
        headers: {

          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
      };
      const response = await fetch("/api/getcurrentglucose", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        console.log(data.detail)
      }
      else {
        setCurrentGlucose(data.value)
      }
    }
    getCurrentGlucose()
  },);

  return (
      <>
        <h1>{currentGlucose}</h1>
      </>
  );
};

export default CurrentGlucoseLevel;