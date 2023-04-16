import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/UserContext";
import {VictoryChart, VictoryLine, VictoryTheme} from "victory";

const PastDayGraph = () => {
  const {authToken,} = useContext(UserContext);
  const [token,] = authToken;
  const [graphData, setGraphData] = useState([])


  useEffect(() => {
    const getPastDayGlucose = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
      };
      const response = await fetch("/api/getpastdayegvs", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        console.log(data.detail)
      }
      else {
        setGraphData(data.xy_pairs)
        //TODO: why is VVVVthisVVVV not printing graphdata????

        console.log(graphData)

      }
    }
    getPastDayGlucose()
  },[token]);



  return (
    <>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
            style={{data: { stroke: "#c43a31" }, parent: { border: "1px solid #ccc"}}}
            data={graphData}/>
      </VictoryChart>
    </>
  );
}

export default PastDayGraph;