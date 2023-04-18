import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryLabel, VictoryArea } from "victory";

const PastDayGraph = () => {
  const { authToken } = useContext(UserContext);
  const [token] = authToken;
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
        //console.log(data);
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
        //console.log(data);
        setGraphData(data.xy_pairs);
      }
    };
    getPastDayGlucose();
  }, [token]);

const MaxPref = data.maximum !== null ? parseInt(data.maximum) : null;
const MinPref = data.minimum !== null ? parseInt(data.minimum) : null;
//const lowestValue = data.minimum !== null ? Math.min(parseInt(data.minimum), 90) : 90; // ADD BACK IN IF WE FIGURE OUT BAD RANGE


  const formatTick = (x) => {
    const hour = new Date(x).getHours();
    if (hour > 12) {
      return hour - 12 + "pm";
    } else if (hour === 0) {
      return 12 + "am";
    } else {
      return hour + "am";
    }
  };

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
          y={() => MaxPref}
          domain={{ y: [MinPref, MaxPref] }}
        />

        <VictoryArea
          style={{ data: { fill: "green", fillOpacity: 0.2 } }}
          y0={() => MinPref}
          y={() => MaxPref}
          domain={{ y: [MinPref, MaxPref] }}
        />
        <VictoryAxis tickFormat={(x) => formatTick(x)} style={{ tickLabels: { fontSize: 6, angle: 60 } }} />
        <VictoryAxis dependentAxis />
      </VictoryChart>
    </div>
  );
};

export default PastDayGraph;