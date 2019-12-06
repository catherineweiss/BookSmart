import React, { Component } from "react";
import { Spinner } from 'reactstrap';
import lodash from 'lodash';
import 'c3/c3.css';

import BorrowingTrendsGraph from "components/BorrowingTrendsGraph";

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
      let borrowingTrends = {}

      for (let key in dataByIsbn) {
          const value = dataByIsbn[key];
          const title = value[0].TITLE;
          let x_axis = [];
          let checkouts = []
          for (let i in value) {
            let record = value[i];

            // build x-axis of dates
            let month;
            if (record.MONTH < 10) {
              month = '0' + record.MONTH.toString();
            } else {
              month = record.MONTH.toString();
            }
            let date = `${record.YEAR.toString()}-${month}-01`;
            x_axis.push(date);

            // collect checkout data
            checkouts.push(record.CHECKOUTS_PER_MONTH);
          }
          borrowingTrends[key] = { 'title': title, 'x_axis': x_axis, 'data': checkouts }
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
        let borrowingTrendsChart =
          <Spinner style={{ width: '3rem', height: '3rem', marginLeft: '48%', marginTop: '20%' }} />
        if (!this.state.loading) {
          borrowingTrendsChart = <BorrowingTrendsGraph data={borrowingTrends}/>
        }
        return (
          <div>
            {borrowingTrendsChart}
          </div>
        );
      }
    }


export default BorrowingTrends;
