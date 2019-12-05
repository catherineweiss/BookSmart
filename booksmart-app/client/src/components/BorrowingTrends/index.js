import React, { Component } from "react";
import C3Chart from 'react-c3js';
import lodash from 'lodash';
import 'c3/c3.css';

class BorrowingTrends extends Component {
    constructor(props) {
        super(props);
        this.callCheckoutsAPI = this.callCheckoutsAPI.bind(this);
        this.callRankingsAPI = this.callRankingsAPI.bind(this);
        this.callAPIs = this.callAPIs.bind(this);
        this.chartifyCheckoutsData = this.chartifyCheckoutsData.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.state = { borrowingTrends: {},
                        rankingTrends: [],
                        title: 'harry potter and the sorcerer',
                        validTitle: false,
                        loading: true,
                        error: '' };
        this.callAPIs();
    }

    chartifyCheckoutsData(data) {
      // Group records by ISBN
      var dataByIsbn = lodash.groupBy(data, 'ISBN');
      var yearData = [];
      var checkoutsData = [];
      // console.log(dataByIsbn);

      for(let key in dataByIsbn) {
          const value = dataByIsbn[key];
          let checkoutsDataPerTitle = [];
          checkoutsDataPerTitle.push(value[0].TITLE);
          // console.log(checkoutsDataPerTitle)
          for (let i in value) {
            let record = value[i];
            let month;
            if (record.MONTH < 10) {
              month = '0' + record.MONTH.toString();
            } else {
              month = record.MONTH.toString();
            }
            var dataRecord = record.YEAR.toString()+'-'+month+'-01';
            // var date = new Date(dataRecord);
            yearData.push(dataRecord);
            checkoutsDataPerTitle.push(record.CHECKOUTS_PER_MONTH);
          }
          checkoutsData.push(checkoutsDataPerTitle)

          yearData = lodash.uniq(yearData).sort()
          yearData = ['x', ...yearData]
          var borrowingTrends = {yearData, checkoutsData};
      }
      return borrowingTrends;
    }

    callCheckoutsAPI() {
        const title = this.state.title;
        // console.log(title);
        const url = "/borrowingtrends/" + title;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                data = this.chartifyCheckoutsData(data);
                this.setState({ borrowingTrends: data, loading: false });
            })
            .catch(err => err);
    }

    callRankingsAPI() {
        const title = this.state.title;
        // console.log(title);
        const url = "/nytrank/" + title;

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ borrowingTrends: data }))
            .catch(err => err);
    }

    callAPIs() {
        this.callCheckoutsAPI();
        this.callRankingsAPI();
    }


    onChangeTitle(event) {
        let title = event.target.value;

        // Validate title input
        if(!title) {
            this.setState({validTitle: false, title, error: 'Please enter book title'});
        }
        else {
            this.setState({validTitle: true, title, error: ''});
        }
    }

    render() {
        let borrowingTrends = this.state.borrowingTrends;
        let borrowingTrendsChart;
        console.log(borrowingTrends);
        //creates the borrowingtrends graph
        let columnData = [];
          if (this.state.loading) {
            borrowingTrendsChart = <div>oh hello!</div>
          } else {
            columnData.push(borrowingTrends.yearData);
            for (let i in borrowingTrends.checkoutsData) {
              columnData.push(borrowingTrends.checkoutsData[i])
            }
            console.log(columnData);
            const data = {
                x: 'x',
                xFormat: '%Y-%m-%d',
                columns: columnData
            };
            const axis = {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
            };
            borrowingTrendsChart = <C3Chart data={data} axis={axis}/>
          }
          return (
            <div>
              {borrowingTrendsChart}
            </div>
          );
       }
    }


export default BorrowingTrends;
