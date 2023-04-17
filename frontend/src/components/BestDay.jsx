import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {VictoryArea, VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme} from "victory";
const BestDay = () => {
  const { authToken } = useContext(UserContext);
  const [token] = authToken;
  const [bestDay, setBestDay] = useState("");
  const [bestDayStd, setBestDayStd] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [isActive, ] = useState(true);
  const [, setErrorMessage] = useState("");
  const [data, setData] = useState({ maximum: null, minimum: null });

      useEffect(() => {
    const getPreferences = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch("/api/getpreferences", requestOptions);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error("Error retrieving preferences from backend.");
        }
        setData({ maximum: data.maximum, minimum: data.minimum });
      }
      catch (error) {
        setErrorMessage(error.message);
      }
    };
      getPreferences();
  },[isActive]);
      
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
        console.log(data.detail);
      } else {
        console.log(data);
        setBestDay(new Date(data.best_day).toLocaleDateString("en-US"));
        setBestDayStd(data.best_day_std.toFixed(2));
        setGraphData(data.xy_pairs);
      }
    };
    getBestDay();
  }, [token]);

  const MaxPref = data.maximum !== null ? parseInt(data.maximum) : null;
  const MinPref = data.minimum !== null ? parseInt(data.minimum) : null;
  const lowestValue = data.minimum !== null ? Math.min(parseInt(data.minimum), 90) : 90;

   const formatTick = (x) => {
     const hour = new Date(x).getHours();
     if (hour > 12) {
         return hour - 12 + "pm";
     } else if (hour == 0) {
         return hour + 12 + "am";
     } else {
      return hour + "am";
    }
  };

    return (
        <div className="box">
          <p style={{ textAlign: "center" }}>
            Best day: <strong>{bestDay}</strong>
          </p>
          <p style={{ textAlign: "center" }}>
            Best day standard deviation: <strong>{bestDayStd}</strong>
          </p>
          <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
            <VictoryLabel x={150} y={20} text="Best Day" textAnchor="middle" />
            <VictoryLine
              style={{
                data: { stroke: "#2491ac" },
                parent: { border: "1px solid #ccc" },
              }}
              data={graphData}
            />
              <VictoryLine
              style={{ data: { stroke: "rgba(46,234,99,0.5)", strokeWidth: 0 } }}
              y={() => MaxPref}
              domain={{ y: [MinPref, MaxPref] }}
            />
            <VictoryLine
              style={{ data: { stroke: "rgba(196, 58, 49, 0.5)", strokeWidth: 0 } }}
              y={() => MinPref}
              domain={{ y: [lowestValue, MinPref] }}
            />
            <VictoryLine
              style={{ data: { stroke: "rgba(196, 58, 49, 0.5)", strokeWidth: 0 } }}
              y={() => lowestValue}
              domain={{ y: [lowestValue, MinPref] }}
            />
            <VictoryArea
              style={{ data: { fill: "red", fillOpacity: 0.2 } }}
              y0={() => lowestValue}
              y={() => MinPref}
              domain={{ y: [lowestValue, MinPref] }}
            />
            <VictoryArea
              style={{ data: { fill: "green", fillOpacity: 0.2 } }}
              y0={() => MinPref}
              y={() => MaxPref}
              domain={{ y: [MinPref, MaxPref] }}
            />
            <VictoryAxis
              tickFormat={(x) => formatTick(x)}
              style={{ tickLabels: { fontSize: 6, angle: 60 } }}
            />
            <VictoryAxis dependentAxis />
          </VictoryChart>
        </div>
      );
};

export default BestDay;