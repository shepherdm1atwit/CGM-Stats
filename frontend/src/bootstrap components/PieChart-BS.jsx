/**
 * @file PieChart.jsx
 * @brief Component to display blood glucose distribution as a pie chart.
 */

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";   ///< Global user context.
import Plotly from "react-plotly.js";  ///< Plotly component for rendering pie chart.

/**
 * PieChart Component
 *
 * This component fetches and visualizes the blood glucose data distribution
 * over the past day in a pie chart. It segments the values based on the user's
 * preferences: above, within, and below the desired range.
 *
 * @returns {JSX.Element} The rendered PieChart component.
 */
const PieChart = () => {
  // Extract required states and methods from the UserContext
  const { authToken, userPrefs, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [, setSessionExpired] = sessionExp;
  const [chartValues, setChartValues] = useState([]);
  const [prefs] = userPrefs;

  /**
   * Uses an effect hook to make an API request to fetch distribution of blood
   * glucose over the past day upon component mounting.
   */
  useEffect(() => {
    const getPastDayPie = async () => {
      // Request configurations
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/getpastdaypie", requestOptions);
      const data = await response.json();
      // Error handling and data setting
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

  // Check if preferences have been set and if so, render the pie chart
  if (chartValues.length === 0) {
    return <div>Please enter preferences to view this graph.</div>;
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

    // Layout configurations
    let layout = {
      title: "Blood Glucose over Last 24 hours",
    };

    // Plotly graph configurations
    let config = { responsive: true };
    return <Plotly data={data} layout={layout} config={config} />;
  }
};

export default PieChart;
