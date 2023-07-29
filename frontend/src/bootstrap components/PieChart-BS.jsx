import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Plotly from "react-plotly.js";

const PieChart = () => {
  const { authToken, userPrefs, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [, setSessionExpired] = sessionExp;
  const [graphData, setGraphData] = useState([]);
  const [prefs] = userPrefs;

  const maxPref = prefs.maximum !== null ? parseInt(prefs.maximum) : null;
  const minPref = prefs.minimum !== null ? parseInt(prefs.minimum) : null;

  useEffect(() => {
    const getPastDayGlucose = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/getpastdayegvs", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        if (data.detail === "Your session has expired.") {
          setSessionExpired(true);
          setToken("null");
        }
      } else {
        setGraphData(data.xy_pairs);
      }
    };
    getPastDayGlucose();
  }, []);

  if (graphData.length === 0) {
    return <div>Please enter preferences to use this component</div>;
  } else {
    let above = 0;
    let within = 0;
    let below = 0;

    graphData.forEach((pair) => {
      const value = pair.y; // Assuming y is the value you want to analyze

      if (value > maxPref) above++;
      else if (value < minPref) below++;
      else within++;
    });

    const total = above + within + below;
    const abovePercent = (above / total) * 100;
    const withinPercent = (within / total) * 100;
    const belowPercent = (below / total) * 100;

    const data = [{
      values: [abovePercent, withinPercent, belowPercent],
      labels: ["Above Desired Level", "In Desired Range", "Below Desired Range"],
      type: 'pie'
    }];

    return <Plotly data={data} />;
  }
};

export default PieChart;
