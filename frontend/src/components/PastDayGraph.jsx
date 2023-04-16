import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from "victory";

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

  return (
    <div className="box">
      <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={graphData}
        />
        <VictoryAxis
          tickFormat={(x) => new Date(x).getHours() + "h"}
          style={{ tickLabels: { fontSize: 5 } }}
        />
        <VictoryAxis dependentAxis />
      </VictoryChart>
    </div>
  );
};

export default PastDayGraph;