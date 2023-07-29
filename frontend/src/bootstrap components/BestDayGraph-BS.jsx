import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Plot from "react-plotly.js";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const BestDayGraph = () => {
  const { authToken, userPrefs, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [, setSessionExpired] = sessionExp;
  const [bestDay, setBestDay] = useState("");
  const [bestDayStd, setBestDayStd] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [, setErrorMessage] = useState("");
  const [prefs] = userPrefs;

  useEffect(() => {
    const getBestDay = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/getbestday", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        if (data.detail === "Your session has expired.") {
          setSessionExpired(true);
          setToken("null");
        }
      } else {
        setBestDay(new Date(data.best_day).toLocaleDateString("en-US"));
        setBestDayStd(data.best_day_std.toFixed(2));
        setGraphData(data.xy_pairs);
      }
    };
    getBestDay();
  }, []);

  const maxPref = prefs.maximum !== null ? parseInt(prefs.maximum) : null;
  const minPref = prefs.minimum !== null ? parseInt(prefs.minimum) : null;

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

  let xValues = graphData.map((pair) => formatTick(pair.x));
  let yValues = graphData.map((pair) => pair.y);

  let plotData = [
    {
      x: xValues,
      y: yValues,
      type: "scatter",
      mode: "lines+markers",
      name: "Best Day",
      line: { color: "#07cccc" },
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
      title: "Time of Reading",
      tickangle: 45,
    },
    yaxis: {
      title: "Blood Glucose Level",
    },
    showlegend: false, // This line will hide the legend
  };

  let config = { responsive: true };

  return (
    <Card>
      <Card.Body>
        <Card.Title align="center">
          <h2>Best Day</h2>
        </Card.Title>
        <Card.Text className="justify-content-center">
          <p className="m-0" style={{ textAlign: "center" }}>
            Best day: <strong>{bestDay}</strong>
          </p>
          <p className="m-0" style={{ textAlign: "center" }}>
            Best day standard deviation: <strong>{bestDayStd}</strong>
          </p>
          <Plot data={plotData} layout={layout} config={config} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BestDayGraph;
