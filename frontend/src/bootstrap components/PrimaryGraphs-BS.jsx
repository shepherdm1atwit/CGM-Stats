import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import CurrentGlucoseLevel from "./CurrentGlucoseLevel-BS";
import PastDayGraph from "./PastDayGraph-BS";
import BestDayGraph from "./BestDayGraph-BS";

const graphs = [<CurrentGlucoseLevel />, <PastDayGraph />];

const PrimaryGraphs = () => {
  return (
    <>
      <div
        className="graph-container"
        style={{ paddingLeft: "10%", paddingRight: "10%" }}
      >
        {graphs.map((graph, index) => (
          <div className="graph pt-3" key={index}>
            {graph}
          </div>
        ))}
      </div>
    </>
  );
};

export default PrimaryGraphs;
