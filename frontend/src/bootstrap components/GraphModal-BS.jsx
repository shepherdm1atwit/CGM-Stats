import React, { useState } from 'react';
import { Carousel, Modal } from 'react-bootstrap';
import CurrentGlucoseLevel from "./CurrentGlucoseLevel-BS";
import PastDayGraph from "./PastDayGraph-BS";
import BestDayGraph from "./BestDayGraph-BS";

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
      <Carousel>
        {graphs.map((graph, index) => (
          <Carousel.Item key={index} onClick={() => handleGraphClick(graph)}>
            <div className="graph">
              {graph}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
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
