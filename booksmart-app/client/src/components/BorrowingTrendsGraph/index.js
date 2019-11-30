import React, { Component } from "react";

import React from 'react';
import C3Chart from 'react-c3js';
import REACTDOM from "react-dom";

class BorrowingTrendsGraph extends Component {
	constructor(props) {
		this.callAPI = this.callAPI.bind(this);
		this.state = { jsonData : [] }
	}

	callAPI() {
		const url = "/borrowingtrendsgraph/";

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ jsonData: data }))
            .catch(err => err);
	}

	renderChart() {
        this.chart = c3.generate({
            bindto:"#chart1",
            data: {
                columns: jsonData
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