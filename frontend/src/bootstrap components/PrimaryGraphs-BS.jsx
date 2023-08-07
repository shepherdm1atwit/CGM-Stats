/**
 * @file PrimaryGraphs.jsx
 * @brief Component that houses primary graph visualizations.
 */

import React from "react";  // Basic React imports
import CurrentGlucoseLevel from "./CurrentGlucoseLevel-BS";  ///< Import of the current glucose level component.
import PastDayGraph from "./PastDayGraph-BS";  ///< Import of the past day glucose data graph component.

// Array of primary graph components to be rendered.
const graphs = [<CurrentGlucoseLevel />, <PastDayGraph />];

/**
 * PrimaryGraphs Component
 *
 * This component serves as a container for primary graph visualizations.
 * It displays a series of graph components in a consistent format.
 *
 * @returns {JSX.Element} The rendered PrimaryGraphs component.
 */
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
