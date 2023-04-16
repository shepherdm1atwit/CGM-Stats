import React, { useState } from 'react';
import { Modal } from 'react-bulma-components';
import CurrentGlucoseLevel from "./CurrentGlucoseLevel";
import PastDayGraph from "./PastDayGraph";

const graphs = [
    <CurrentGlucoseLevel />,
    <PastDayGraph />
];

const GraphModal = () => {
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGraphClick = (graph) => {
    setSelectedGraph(graph);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {graphs.map((graph, index) => (
        <div key={index} className="graph" onClick={() => handleGraphClick(graph)}>
          {graph}
        </div>
      ))}
      {selectedGraph && (
        <Modal show={isModalOpen} onClose={handleCloseModal}>
          <Modal.Content>
            {selectedGraph}
          </Modal.Content>
        </Modal>
      )}
    </>
  );
};

export default GraphModal;