import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {VictoryArea, VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme} from "victory";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const BestDayGraph = () => {
  const { authToken, sessionExp } = useContext(UserContext);
  const [token, setToken] = authToken;
  const [,setSessionExpired] = sessionExp;
  const [bestDay, setBestDay] = useState("");
  const [bestDayStd, setBestDayStd] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [isActive, ] = useState(true);
  const [, setErrorMessage] = useState("");
  const [prefs, setPrefs] = useState({ maximum: null, minimum: null });
      
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
          if (data.detail==="Your session has expired."){
            setSessionExpired(true);
            setToken(null);
          }
        //console.log(data.detail);
      } else {
        //console.log(data);
        setBestDay(new Date(data.best_day).toLocaleDateString("en-US"));
        setBestDayStd(data.best_day_std.toFixed(2));
        setGraphData(data.xy_pairs);
      }
    };
    getBestDay();

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
        if (!response.ok) {
          if (data.detail==="Your session has expired."){
            setSessionExpired(true);
            setToken(null);
          }
          else {
                throw new Error("Error retrieving preferences from backend.");
            }
        }
        setPrefs({ maximum: data.maximum, minimum: data.minimum });
      }
      catch (error) {
        setErrorMessage(error.message);
      }
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
      <Card>
        <Card.Text className="justify-content-center">
          <h2 className="m-0" align="center">Best Day</h2>
          <p className="m-0" style={{ textAlign: "center" }}>
            Best day: <strong>{bestDay}</strong>
          </p>
          <p className="m-0" style={{ textAlign: "center" }}>
            Best day standard deviation: <strong>{bestDayStd}</strong>
          </p>
        </Card.Text>
        <VictoryChart theme={VictoryTheme.material} width={300} height={150} padding={{bottom: 25, left:40, right:40}}>
          <VictoryLine
            style={{
              data: { stroke: "#07cccc" },
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

          <VictoryAxis tickFormat={(x) => formatTick(x)} style={{ tickLabels: { fontSize: 6, angle: 60 } }} />
          <VictoryAxis dependentAxis />
        </VictoryChart>
      </Card>
    );
  }
  else {
    return (
      <Container className="d-flex justify-content-center">
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
              data: { stroke: "#07cccc" },
              parent: { border: "1px solid #ccc" },
            }}
            data={graphData}
          />
          <VictoryAxis tickFormat={(x) => formatTick(x)} style={{ tickLabels: { fontSize: 6, angle: 60 } }} />
          <VictoryAxis dependentAxis />
        </VictoryChart>
      </Container>
    );
  }

};

export default BestDayGraph;