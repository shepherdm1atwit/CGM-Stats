import React, { useState } from 'react';
import CurrentGlucoseLevel from "./CurrentGlucoseLevel-BS";
import PastDayGraph from "./PastDayGraph-BS";
import BestDayGraph from "./BestDayGraph-BS";
import {Modal} from "react-bootstrap";

const graphs = [
    <CurrentGlucoseLevel />,
    <PastDayGraph />,
    <BestDayGraph />
];

const GraphModal = () => {
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
      {graphs.map((graph, index) => (
        <div key={index} className="graph" onClick={() => handleGraphClick(graph)}>
          {graph}
        </div>
      ))}
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

export default GraphModal;