import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryArea,
} from "victory";

const PastDayGraph = () => {
  const { authToken, userPrefs, sessionExp } = useContext(UserContext);
  const [, setSessionExpired] = sessionExp;
  const [token, setToken] = authToken;
  const [graphData, setGraphData] = useState([]);
  const [isActive] = useState(true);
  const [prefs] = userPrefs;

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
        //console.log(data.detail);
      } else {
        setGraphData(data.xy_pairs);
      }
    };
    getPastDayGlucose();
  }, [isActive]);

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

  if (maxPref != null && minPref != null) {
    return (
      <div className="box">
        <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
          <VictoryLabel x={150} y={20} text="Past Day" textAnchor="middle" />
          <VictoryLine
            style={{
              data: { stroke: "#058705" },
              parent: { border: "1px solid #ccc" },
            }}
            data={graphData}
          />

          <VictoryLine
            style={{ data: { stroke: "rgba(46,234,99,0.5)", strokeWidth: 0 } }}
            y={() => maxPref}
            domain={{ y: [minPref, maxPref] }}
          />
          <VictoryArea
            style={{ data: { fill: "green", fillOpacity: 0.2 } }}
            y0={() => minPref}
            y={() => maxPref}
            domain={{ y: [minPref, maxPref] }}
          />

          <VictoryAxis
            tickFormat={(x) => formatTick(x)}
            style={{ tickLabels: { fontSize: 6, angle: 60 } }}
          />
          <VictoryAxis dependentAxis />
        </VictoryChart>
      </div>
    );
  } else {
    return (
      <div className="box">
        <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
          <VictoryLabel x={150} y={20} text="Past Day" textAnchor="middle" />
          <VictoryLine
            style={{
              data: { stroke: "#058705" },
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
  }
};

export default PastDayGraph;
