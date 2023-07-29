import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Modal } from "react-bootstrap";
import CurrentGlucoseLevel from "./CurrentGlucoseLevel-BS";
import PastDayGraph from "./PastDayGraph-BS";
import BestDayGraph from "./BestDayGraph-BS";
import PieChart from "./PieChart-BS";

const graphs = [<PastDayGraph />, <BestDayGraph />, <PieChart />];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const GraphCarousel = () => {
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
      <Carousel
        swipeable={false}
        draggable={false}
        showDots={true}
        responsive={responsive}
        infinite={true}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
      >
        {graphs.map((graph, index) => (
          <div
            className="graph"
            key={index}
            onClick={() => handleGraphClick(graph)}
          >
            {graph}
          </div>
        ))}
      </Carousel>
      {selectedGraph && (
        <Modal show={isActive} onHide={handleClose}>
          <Modal.Header closeButton />
          <Modal.Body className="modal-content">{selectedGraph}</Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default GraphCarousel;
