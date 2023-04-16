import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryLabel } from "victory";

const PastDayGraph = () => {
  const { authToken } = useContext(UserContext);
  const [token] = authToken;
  const [graphData, setGraphData] = useState([]);

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
        console.log(data.detail);
      } else {
        console.log(data);
        setGraphData(data.xy_pairs);
      }
    };
    getPastDayGlucose();
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
      <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
          <VictoryLabel
              x={150}
              y={20}
              text="Past Day"
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
          style={{ tickLabels: { fontSize: 4 } }}
        />
        <VictoryAxis dependentAxis />
      </VictoryChart>
    </div>
  );
};

export default PastDayGraph;