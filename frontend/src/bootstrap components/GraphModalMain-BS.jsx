import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import CurrentGlucoseLevel from "./CurrentGlucoseLevel-BS";
import PastDayGraph from "./PastDayGraph-BS";
import BestDayGraph from "./BestDayGraph-BS";

const graphs = [
    <CurrentGlucoseLevel />,
    <PastDayGraph />,
    <BestDayGraph />
];

const GraphModalMain = () => {
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleGraphClick = (graph) => {
    setSelectedGraph(graph);
    setIsActive(true);
  };

  const handleClose = () => {
    setIsActive(false);
  };

  return (
    <>
      <div className="graph-container" style={{ paddingLeft: "20%", paddingRight: "20%" }}>
        {graphs.map((graph, index) => (
          <div className="graph" key={index} onClick={() => handleGraphClick(graph)}>
            {graph}
          </div>
        ))}
      </div>
      {selectedGraph && (
        <Modal className="modal-xl" show={isActive} onHide={handleClose}>
          <Modal.Header closeButton />
          <Modal.Body>
            {selectedGraph}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default GraphModalMain;
