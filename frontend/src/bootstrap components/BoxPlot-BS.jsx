import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Plot from "react-plotly.js";

const BoxPlot = () => {
  const { authToken, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [, setSessionExpired] = sessionExp;
  const [plotValues, setPlotValues] = useState([]);
  const [plotLabels, setPlotLabels] = useState([]);

  useEffect(() => {
    const getPastWeekBoxPlot = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/getpastweekboxplot", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        if (data.detail === "Your session has expired.") {
          setSessionExpired(true);
          setToken("null");
        }
      } else {
        setPlotValues(data.values);
        setPlotLabels(data.days);
      }
    };
    getPastWeekBoxPlot();
  }, [token, setSessionExpired, setToken]);

  let data = [];
  for (let i = 0; i < plotValues.length; i++) {
    let day = {
      y: plotValues[i],
      type: "box",
      name: plotLabels[i],
    };
    data.push(day);
  }
  let layout = {
    title: "Glucose range by day in past week",
  };

  return <Plot data={data} layout={layout} />;
};

export default BoxPlot;
