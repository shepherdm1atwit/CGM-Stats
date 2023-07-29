import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import CurrentGlucoseLevel from "./CurrentGlucoseLevel-BS";
import PastDayGraph from "./PastDayGraph-BS";
import BestDayGraph from "./BestDayGraph-BS";
import BoxPlot from "./BoxPlot-BS";

const graphs = [<CurrentGlucoseLevel />, <BoxPlot />];

const GraphModalMain = () => {
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

export default GraphModalMain;
