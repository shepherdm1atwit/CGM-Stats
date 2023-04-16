import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/UserContext";
import {Chart} from "react-chartjs-2";

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
        setGraphData(data.graphData)
        console.log(graphData)
      }
    }
    getPastDayGlucose()
  },[token]);



  return (
    <>
      <h1>THIS IS NOT DONE, NEEDS FINISHING</h1>
    </>
  );
}

export default PastDayGraph;