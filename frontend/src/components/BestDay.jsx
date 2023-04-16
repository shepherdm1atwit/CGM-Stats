import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme} from "victory";
const BestDay = () => {
  const { authToken } = useContext(UserContext);
  const [token] = authToken;
  const [bestDay, setBestDay] = useState("");
  const [bestDayStd, setBestDayStd] = useState("");
  const [graphData, setGraphData] = useState([]);

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
        setBestDay(data.best_day);
        setBestDayStd(data.best_day_std);
        setGraphData(data.xy_pairs);
      }
    };
    getBestDay();
  }, [token]);

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
      <p>Best day: {bestDay}</p>
      <p>Best day standard Deviation: {bestDayStd}</p>
      <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
          <VictoryLabel
              x={150}
              y={20}
              text="Best Day"
              textAnchor="middle"
              />
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={graphData}
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