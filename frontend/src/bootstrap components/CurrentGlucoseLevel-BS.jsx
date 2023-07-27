import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Card from "react-bootstrap/Card";
import {
  ArrowDownRight,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
} from "react-feather";

const CurrentGlucoseLevel = () => {
  const { authToken } = useContext(UserContext);
  const [token, setToken] = authToken;
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
        if (data.detail === "Your session has expired.") {
          setSessionExpired(true);
          setToken("null");
        }
      } else {
        const currentGlucoseValue = data.value;
        setCurrentGlucose(currentGlucoseValue);
        const currentTrendValue = data.trend;
        setCurrentTrend(currentTrendValue);
      }
    };
    getCurrentGlucose();
  }, []);

  let arrowIcon = null;

  switch (currentTrend) {
    case "doubleUp":
      arrowIcon = <ArrowUpRight size="32" strokeWidth="1" />;
      break;
    case "singleUp":
      arrowIcon = <ArrowUp size="32" strokeWidth="1" />;
      break;
    case "fortyFiveUp":
      arrowIcon = <ArrowUpRight size="32" strokeWidth="1" />;
      break;
    case "flat":
      arrowIcon = <ArrowRight size="32" strokeWidth="1" />;
      break;
    case "fortyFiveDown":
      arrowIcon = <ArrowDownRight size="32" strokeWidth="1" />;
      break;
    case "singleDown":
      arrowIcon = <ArrowDown size="32" strokeWidth="1" />;
      break;
    case "doubleDown":
      arrowIcon = <ArrowDownRight size="32" strokeWidth="1" />;
      break;
    default:
      arrowIcon = <ArrowRight size="32" strokeWidth="1" />;
  }

  const getProgressBarColor = (glucoseLevel) => {
    if(glucoseLevel <= 70) return '#ff5722';
    if(glucoseLevel >= 180) return '#fbc02d';
    return '#4caf50';
  };

  return (
    <Card>
      <h2 className="m-0" align="center">
        Most Recent EGV
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ width: 100, height: 100, marginRight: '1rem' }}>
          <CircularProgressbar
            value={currentGlucose}
            text={`${currentGlucose} mg/dL`}
            maxValue={400}
            styles={buildStyles({
              strokeLinecap: 'butt',
              textSize: '16px',
              pathColor: getProgressBarColor(currentGlucose),
              textColor: '#000',
              trailColor: '#ddd',
            })}
          />
        </div>
        {arrowIcon}
      </div>
    </Card>
  );
};

export default CurrentGlucoseLevel;
