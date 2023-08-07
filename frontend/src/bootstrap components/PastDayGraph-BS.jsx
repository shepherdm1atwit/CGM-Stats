/**
 * @file PastDayGraph.jsx
 * @brief Component to display the past day's blood glucose graph.
 */
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Plot from "react-plotly.js";
import Card from "react-bootstrap/Card";

/**
 * PastDayGraph Component
 *
 * This component fetches and visualizes the blood glucose data for the past day.
 * The data includes x-y pairs where 'x' represents the time of reading and 'y'
 * represents the blood glucose level. User-defined maximum and minimum levels are
 * also shown on the graph.
 *
 * @returns {JSX.Element} The rendered PastDayGraph component.
 */
const PastDayGraph = () => {
  const { authToken, userPrefs, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [, setSessionExpired] = sessionExp;
  const [graphData, setGraphData] = useState([]);
  const [isActive] = useState(true);
  const [prefs] = userPrefs;

  /**
   * Uses an effect hook to make an API request to fetch past day's blood glucose data
   * upon component mounting.
   */
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

  /**
   * Formats the x-axis tick based on 12-hour format.
   * @param {number} x - The x value (time) to be formatted.
   * @returns {string} Formatted time string.
   */
  const formatTick = (x) => {
    let hour = new Date(x).getHours();
    if (hour > 12) {
      return hour - 12 + "pm";
    } else if (hour === 12) {
      return 12 + "pm";
    } else if (hour === 0) {
      return 12 + "am";
    } else {
      return hour + "am";
    }
  };

  const maxPref = prefs.maximum !== null ? parseInt(prefs.maximum) : null;
  const minPref = prefs.minimum !== null ? parseInt(prefs.minimum) : null;

  let xValues = graphData.map((pair) => formatTick(pair.x));
  let yValues = graphData.map((pair) => pair.y);

  let plotData = [
    {
      x: xValues,
      y: yValues,
      type: "scatter",
      mode: "lines",
      name: "Desired Range",
      line: { color: "#058705" },
    },
  ];

  if (maxPref != null && minPref != null) {
    plotData.push(
      {
        x: [xValues[0], xValues[xValues.length - 1]],
        y: [minPref, minPref],
        mode: "lines",
        line: { color: "rgba(46,234,99,0.5)", width: 0 },
        showlegend: false,
      },
      {
        x: [xValues[0], xValues[xValues.length - 1]],
        y: [maxPref, maxPref],
        mode: "lines",
        fill: "tonexty",
        fillcolor: "rgba(46,234,99,0.2)",
        line: { color: "rgba(46,234,99,0.5)", width: 0 },
        showlegend: false,
      }
    );
  }

  let layout = {
    xaxis: {
      title: "Time of Reading", // x-axis title
      tickangle: 45,
    },
    yaxis: {
      title: "Blood Glucose Level", // y-axis title
    },
    showlegend: false, // This line will hide the legend
  };

  let config = { responsive: true };

  // Render the past day's graph within a card
  return (
    <Card>
      <Card.Text className="justify-content-center">
        <h2 className="mb-3" align="center">
          Past Day
        </h2>
      </Card.Text>
      <Plot data={plotData} layout={layout} config={config} />
    </Card>
  );
};

export default PastDayGraph;
