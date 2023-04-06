import React, { useState, useEffect, useContext } from "react";
import { Line } from "react-chartjs-2";
import {UserContext} from "../context/UserContext";

const CurrentGlucoseLevel = () => {
  const { authToken, dexConnect } = useContext(UserContext);
  const [glucoseData, setGlucoseData] = useState(null);

  // Define the Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          type: "time",
          distribution: "linear",
          time: {
            unit: "minute",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            suggestedMax: 300,
          },
        },
      ],
    },
  };

  useEffect(() => {
    const fetchGlucoseData = async () => {
      if (!dexConnect) {
        console.log("Dexcom not connected");
        return;
      }
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken[0],
          "x-dexcom-device-type": "t:simulator",
          "x-dexcom-device-version": "1.0",
          "x-dexcom-app-version": "1.5.0",
        },
      };
      const response = await fetch(
        "https://sandbox-api.dexcom.com/v2/users/self/egvs?startDate=2022-04-06T00:00:00&endDate=2022-04-07T00:00:00&sortDesc=true",
        requestOptions
      );
      const data = await response.json();
      setGlucoseData(data.egvs);
    };
    fetchGlucoseData();
  }, [authToken, dexConnect]);

  if (!glucoseData) {
    return <p>Loading...</p>;
  }

  // Prepare the Chart.js data
  const chartData = {
    datasets: [
      {
        label: "Glucose Level",
        data: glucoseData.map((reading) => {
          return {
            x: new Date(reading.displayTime),
            y: reading.value,
          };
        }),
        fill: false,
        borderColor: "#007bff",
      },
    ],
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Current Glucose Level</h5>
      </div>
      <div className="card-body">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CurrentGlucoseLevel;