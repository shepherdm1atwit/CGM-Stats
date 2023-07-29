import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Plotly from "react-plotly.js";

const PieChart = () => {
  const { authToken, userPrefs, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [, setSessionExpired] = sessionExp;
  const [chartValues, setChartValues] = useState([]);
  const [prefs] = userPrefs;

  useEffect(() => {
    const getPastDayPie = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/getpastdaypie", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        if (data.detail === "Your session has expired.") {
          setSessionExpired(true);
          setToken("null");
        }
      } else {
        setChartValues(data.values);
      }
    };
    getPastDayPie();
  }, []);

  if (chartValues.length === 0) {
    return <div>Please enter preferences to use this component</div>;
  } else {
    const data = [
      {
        values: chartValues,
        labels: [
          "Above Desired Range",
          "In Desired Range",
          "Below Desired Range",
        ],
        type: "pie",
      },
    ];
    let config = { responsive: true };
    return <Plotly data={data} config={config} />;
  }
};

export default PieChart;
