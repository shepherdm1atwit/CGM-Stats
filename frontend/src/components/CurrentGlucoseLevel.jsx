import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ArrowDownRight, ArrowDown, ArrowRight, ArrowUp, ArrowUpRight } from 'react-feather';

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
      arrowIcon = <ArrowUpRight size="32" strokeWidth="1" />;
      arrowColor = "red";
      break;
    case "singleUp":
      arrowIcon = <ArrowUp size="32" strokeWidth="1" />;
      arrowColor = "orange";
      break;
    case "fortyFiveUp":
      arrowIcon = <ArrowUpRight size="32" strokeWidth="1" />;
      arrowColor = "#FFD700";
      break;
    case "flat":
      arrowIcon = <ArrowRight size="32" strokeWidth="1" />;
      arrowColor = "lightgreen";
      break;
    case "fortyFiveDown":
      arrowIcon = <ArrowDownRight size="32" strokeWidth="1" />;
      arrowColor = "#FFD700";
      break;
    case "singleDown":
      arrowIcon = <ArrowDown size="32" strokeWidth="1" />;
      arrowColor = "orange";
      break;
    case "doubleDown":
      arrowIcon = <ArrowDownRight size="32" strokeWidth="1" />;
      arrowColor = "red";
      break;
    case "notComputable":
      arrowIcon = <ArrowRight size="32" strokeWidth="1" />;
      arrowColor = "grey";
      break;
    case "rateOutOfRange":
      arrowIcon = <ArrowRight size="32" strokeWidth="1" />;
      arrowColor = "grey";
      break;
    default:
      arrowIcon = <ArrowRight size="32" strokeWidth="1" />;
      arrowColor = "grey";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "bold" }}>Current Glucose Level</div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
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
          <div>{currentGlucose}</div>
          <div style={{ fontSize: "0.6rem" }}>mg/dl</div>
        </div>
        {arrowIcon && <span style={{ color: arrowColor }}>{arrowIcon}</span>}
      </div>
    </div>
  );
};

export default CurrentGlucoseLevel;