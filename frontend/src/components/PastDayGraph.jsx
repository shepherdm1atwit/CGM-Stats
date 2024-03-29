import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryLabel, VictoryArea } from "victory";

const PastDayGraph = () => {
  const { authToken } = useContext(UserContext);
  const [token] = authToken;
  const [graphData, setGraphData] = useState([]);
  const [isActive, ] = useState(true);
  const [prefs, setPrefs] = useState({ maximum: null, minimum: null });

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
        setGraphData(data.xy_pairs);
      }
    };
    getPastDayGlucose();

    const getPreferences = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await fetch("/api/getpreferences", requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Error retrieving preferences from backend.");
        }
        setPrefs({ maximum: data.maximum, minimum: data.minimum });
    };
    getPreferences();

  }, [isActive]);


  const formatTick = (x) => {
    let hour = new Date(x).getHours();
    if (hour > 12) {
      return hour - 12 + "pm";
    }
    else if (hour === 12) {
      return 12 + "pm";
    }
    else if (hour === 0) {
      return 12 + "am";
    }
    else {
      return hour + "am";
    }
  };

  const maxPref = prefs.maximum !== null ? parseInt(prefs.maximum) : null;
  const minPref = prefs.minimum !== null ? parseInt(prefs.minimum) : null;

  if(maxPref != null && minPref != null){
    return (
      <div className="box">
        <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
          <VictoryLabel x={150} y={20} text="Past Day" textAnchor="middle" />
          <VictoryLine
            style={{ data: { stroke: "#058705" }, parent: { border: "1px solid #ccc" } }}
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

          <VictoryAxis tickFormat={(x) => formatTick(x)} style={{ tickLabels: { fontSize: 6, angle: 60 } }} />
          <VictoryAxis dependentAxis />
        </VictoryChart>
      </div>
    );
  }
  else{
    return (
      <div className="box">
        <VictoryChart theme={VictoryTheme.material} width={300} height={200}>
          <VictoryLabel x={150} y={20} text="Past Day" textAnchor="middle" />
          <VictoryLine
            style={{ data: { stroke: "#058705" }, parent: { border: "1px solid #ccc" } }}
            data={graphData}
          />
          <VictoryAxis tickFormat={(x) => formatTick(x)} style={{ tickLabels: { fontSize: 6, angle: 60 } }} />
          <VictoryAxis dependentAxis />
        </VictoryChart>
      </div>
    );
  }


};

export default PastDayGraph;