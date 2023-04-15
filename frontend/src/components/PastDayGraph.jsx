var ctx = document.getElementById("myChart");

// The original draw function for the line chart. This will be applied after we have drawn our highlight range (as a rectangle behind the line chart).
var originalLineDraw = Chart.controllers.line.prototype.draw;
// Extend the line chart, in order to override the draw function.
Chart.helpers.extend(Chart.controllers.line.prototype, {
  draw : function() {
    var chart = this.chart;
    // Get the object that determines the region to highlight.
    var yHighlightRange = chart.config.data.yHighlightRange;

    // If the object exists.
    if (yHighlightRange !== undefined) {
      var ctx = chart.chart.ctx;

      var yRangeBegin = yHighlightRange.begin;
      var yRangeEnd = yHighlightRange.end;

      var xaxis = chart.scales['x-axis-0'];
      var yaxis = chart.scales['y-axis-0'];

      var yRangeBeginPixel = yaxis.getPixelForValue(yRangeBegin);
      var yRangeEndPixel = yaxis.getPixelForValue(yRangeEnd);

      ctx.save();

      // The fill style of the rectangle we are about to fill.
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
      // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
      ctx.fillRect(xaxis.left, Math.min(yRangeBeginPixel, yRangeEndPixel), xaxis.right - xaxis.left, Math.max(yRangeBeginPixel, yRangeEndPixel) - Math.min(yRangeBeginPixel, yRangeEndPixel));

      ctx.restore();
    }

    // Apply the original draw function for the line chart.
    originalLineDraw.apply(this, arguments);
  }
});

var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
    }],
    // This, if it exists at all, defines the highlight region.
    yHighlightRange : {
      begin: 6.5,
      end: 12.5
    }
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }
});



import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/UserContext";
import errorMessage from "./ErrorMessage";
import ErrorMessage from "./ErrorMessage";

const CurrentGlucoseLevel = () => {
  const {authToken,} = useContext(UserContext);
  const [token,] = authToken;
  const [EGVs, setEGVs] = useState([])
  const [times, setTimes] = useState([])

  useEffect(() => {
    const getCurrentGlucose = async () => {
      const requestOptions = {
        method: "GET",
        headers: {

          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
      };
      const response = await fetch("/api/getcurrentglucose", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        console.log(data.detail)
      }
      else {
        setCurrentGlucose(data.value)
      }
    }
    getCurrentGlucose()
  },);

  return (
    <>
      <h1>{currentGlucose}</h1>
    </>
  );
}