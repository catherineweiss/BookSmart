import React, { Component } from "react";

import React from 'react';
import C3Chart from 'react-c3js';
import REACTDOM from "react-dom";

class BorrowingTrendsGraph extends Component {

	renderChart() {
        this.chart = c3.generate({
            bindto:"#chart1",
            data: {
                columns: this.props.
            }
        });
    }



  render() {

    this.renderChart()

    return <div id="chart1"></div>;
  }
}

ReactDOM.render(
  <Hello />,
  document.getElementById('container')
);

export default BorrowingTrendsGraph;