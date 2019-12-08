import React, { Component } from "react";
import { findDOMNode } from 'react-dom';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

let c3 = require('c3');

class BorrowingTrendsGraph extends Component {
  render() {
    let data = {};
    let xs = {};
    let x_axes = [];
    let data_arrays = [];
    const trends = this.props.data;
    let count = 1;
    for (let key in trends) {
      const item = trends[key];
      const title = item.title;
      const x_axis = ['x'+count, ...item.x_axis];
      const checkouts = [title, ...item.data];
      xs[title] = 'x' + count;
      x_axes.push(x_axis);
      data_arrays.push(checkouts);
      count++;
    }

    let columns = [];
    for (let i in x_axes) {
      columns.push(x_axes[i]);
    }
    for (let i in data_arrays) {
      columns.push(data_arrays[i]);
    }

    data = {
      xs: { ...xs },
      columns: [...columns],
      unload: true
    };

    let axis = {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    };

    // let node = findDOMNode(this);
    // let chart = c3.generate({ bindto: node, data, axis})

    return (
      <div id={this.props.node}>
        <C3Chart data={data} axis={axis}/>
      </div>
    );
  }
}


export default BorrowingTrendsGraph;
