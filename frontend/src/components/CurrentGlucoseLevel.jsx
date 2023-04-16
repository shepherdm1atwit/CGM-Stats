import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faLongArrowAltUp, faLongArrowAltDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "./ErrorMessage";

const CurrentGlucoseLevel = () => {
  const { authToken } = useContext(UserContext);
  const [token] = authToken;
  const [currentGlucose, setCurrentGlucose] = useState("");
  const [currentTrend, setCurrentTrend] = useState("");

  useEffect(() => {
    const getCurrentGlucose = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/getcurrentglucose", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        console.log(data.detail);
      } else {
        console.log(data.value);
        console.log(data);
        const currentGlucoseValue = data.value;
        setCurrentGlucose(currentGlucoseValue);
        const currentTrendValue = data.trend;
        setCurrentTrend(currentTrendValue);
      }
    };
    getCurrentGlucose();
  }, []);

  let arrowIcon = null;
  let arrowColor = null;

  switch (currentTrend) {
    case "doubleUp":
      arrowIcon = faLongArrowAltUp;
      arrowColor = "red";
      break;
    case "singleUp":
      arrowIcon = faArrowUp;
      arrowColor = "orange";
      break;
    case "fortyFiveUp":
      arrowIcon = faArrowUp;
      arrowColor = "yellow";
      break;
    case "flat":
      arrowIcon = faArrowRight;
      arrowColor = "lightgreen";
      break;
    case "fortyFiveDown":
      arrowIcon = faArrowDown;
      arrowColor = "yellow";
      break;
    case "singleDown":
      arrowIcon = faArrowDown;
      arrowColor = "orange";
      break;
    case "doubleDown":
      arrowIcon = faLongArrowAltDown;
      arrowColor = "red";
      break;
    case "notComputable":
      arrowIcon = faArrowRight;
      arrowColor = "grey";
      break;
    case "rateOutOfRange":
      arrowIcon = faArrowRight;
      arrowColor = "grey";
      break;
    default:
      arrowIcon = faArrowRight;
      arrowColor = "grey";
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#4caf50",
          color: "white",
          fontWeight: "bold",
          fontSize: "2rem",
          marginRight: "1rem",
        }}
      >
        {currentGlucose}
      </div>
      {arrowIcon && (
        <FontAwesomeIcon
          icon={arrowIcon}
          color={arrowColor}
          size="2x"
        />
      )}
    </div>
  );
};

export default CurrentGlucoseLevel;