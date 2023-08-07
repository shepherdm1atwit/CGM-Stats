/**
 * @file GraphCarousel.jsx
 * @brief Component to display various graphs in a carousel format.
 */

import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Modal } from "react-bootstrap";
import PastDayGraph from "./PastDayGraph-BS";
import BestDayGraph from "./BestDayGraph-BS";
import PieChart from "./PieChart-BS";
import BoxPlot from "./BoxPlot-BS";

// List of graph components to be displayed in the carousel.
const graphs = [<PastDayGraph />, <BestDayGraph />, <PieChart />, <BoxPlot />];

/**
 * Configuration settings for the Carousel component.
 * Defines the responsive behavior of the Carousel on different screen sizes.
 */
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
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

/**
 * GraphCarousel Component
 *
 * Displays a series of graphical components in a carousel. Allows for interaction
 * where a clicked graph is displayed in a full-screen modal for closer inspection.
 *
 * @returns {JSX.Element} Rendered carousel of graphs.
 */
const GraphCarousel = () => {
  // State to track the currently selected graph for the modal display.
  const [selectedGraph, setSelectedGraph] = useState(null);
  // State to track if the modal is currently active.
  const [isActive, setIsActive] = useState(false);

  /**
   * Event handler for when a graph within the carousel is clicked.
   *
   * @param {JSX.Element} graph - The graph component that was clicked.
   */
  const handleGraphClick = (graph) => {
    setSelectedGraph(graph);
    setIsActive(true);
  };

  // Event handler for closing the modal.
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
        <Modal show={isActive} onHide={handleClose} fullscreen>
          <Modal.Header closeButton />
          <Modal.Body className="modal-content">{selectedGraph}</Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default GraphCarousel;
