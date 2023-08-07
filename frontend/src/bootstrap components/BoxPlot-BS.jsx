/**
 * @file BoxPlot.jsx
 * @brief Renders a box plot visualization of the user's glucose range over the past week.
 */

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Plot from "react-plotly.js";

/**
 * BoxPlot Component
 *
 * This component fetches and displays a box plot of the user's glucose range for each
 * day over the past week. The x-axis represents days and the y-axis represents the
 * glucose range. If the user's session is expired, it updates the session state.
 *
 * @returns {JSX.Element} Rendered box plot component.
 */
const BoxPlot = () => {
  // Extracting values from UserContext
  const { authToken, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [, setSessionExpired] = sessionExp;
  // State to hold plot values and labels
  const [plotValues, setPlotValues] = useState([]);
  const [plotLabels, setPlotLabels] = useState([]);

  useEffect(() => {
    /**
     * Asynchronous function to fetch glucose data for the past week.
     */
    const getPastWeekBoxPlot = async () => {
      // Define request options for API call
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

  // Format data for Plotly
  let data = [];
  for (let i = 0; i < plotValues.length; i++) {
    let day = {
      y: plotValues[i],
      type: "box",
      name: plotLabels[i],
    };
    data.push(day);
  }

  // Define the layout of the plot
  let layout = {
    title: "Glucose range by day in past week",
  };

  return <Plot data={data} layout={layout} />;
};

export default BoxPlot;
