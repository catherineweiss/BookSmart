import React, { Component } from "react";
import {
  Button,
  Container,
  FormGroup,
  Input
} from 'reactstrap';
import lodash from 'lodash';
import 'c3/c3.css';

import BorrowingTrendsGraph from "components/BorrowingTrendsGraph";
import HeaderSub from "components/HeaderSub";

class BorrowingTrends extends Component {
    constructor(props) {
        super(props);
        this.callCheckoutsAPI = this.callCheckoutsAPI.bind(this);
        this.callRankingsAPI = this.callRankingsAPI.bind(this);
        this.callAPIs = this.callAPIs.bind(this);
        this.chartifyCheckoutsData = this.chartifyCheckoutsData.bind(this);
        this.chartifyRankingsData = this.chartifyRankingsData.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.state = { borrowingTrends: {},
                        rankingTrends: {},
                        title: '',
                        validTitle: false,
                        error: '' };
    }

    chartifyCheckoutsData(data) {
      // Group records by ISBN
      var dataByIsbn = lodash.groupBy(data, 'ISBN');
      let borrowingTrends = {}
      for (let key in dataByIsbn) {
        const value = dataByIsbn[key];
        const title = value[0].TITLE;
        if (!(title in borrowingTrends)) {
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
          borrowingTrends[title] = { 'title': title, 'x_axis': x_axis, 'data': checkouts }
        }
      }
      return borrowingTrends;
    }

    chartifyRankingsData(data) {
      // Group records by ISBN
      var dataByIsbn = lodash.groupBy(data, 'ISBN');
      let rankings = {}
      for (let key in dataByIsbn) {
        let values = dataByIsbn[key]; // array of rankings
        const title = values[0].TITLE;
        if (!(title in rankings)) {
          let x_axis = []
          let ranks = []
          for (let i in values) {

            // build x-axis of dates
            const dateInfo = values[i].BESTSELLERS_DATE.split("-")
            const year = dateInfo[0]
            const month = dateInfo[1]
            const day = dateInfo[2].substr(0,2)
            const date = `${year}-${month}-${day}`
            x_axis.push(date);

            // collect rankings
            const weeklyRank = values[i].RANK
            ranks.push(weeklyRank);
          }
          rankings[title] = { 'title': title, 'x_axis': x_axis, 'data': ranks }
        }
      }
      return rankings;
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
                this.setState({ borrowingTrends: data });
            })
            .catch(err => err);
    }

    callRankingsAPI() {
        const title = this.state.title;
        const url = "/nytrank/" + title;

        fetch(url)
            .then(res => res.json())
            .then(data => {
              data = this.chartifyRankingsData(data);
              this.setState({ rankingTrends: data });
            })
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
        let rankingTrends = this.state.rankingTrends;

        let borrowingTrendsChart = <BorrowingTrendsGraph data={borrowingTrends}/>
        let rankingsChart = <BorrowingTrendsGraph data={rankingTrends}/>

        return (
          <div>
            <Container>
              <HeaderSub />
              <h3 className="title">Borrowing Trends</h3>
              <div>
                When a new bestseller hits the list, should libraries automatically stock up on copies?
                Or are borrowing trends and bestseller trends not closely correlated?
                Librarians can make sense of this with the help of the Borrowing Trends feature.
                For a user-defined book title, BookSmart presents a graphical display of checkouts per month over time.
                If the book was a bestseller, the rank on the list will also be plotted over time.
                The Goodreads average rating and rating count for the title will be provided if available.
              </div>
              <div className="space-50"></div>
              <FormGroup>
                  <Input
                      placeholder="Book Title"
                      type="text"
                      value={this.state.title}
                      onChange={this.onChangeTitle}
                  ></Input>
                  <span style={{color: "red"}}>{this.state.error}</span>
              </FormGroup>
              <div>
                  <Button
                      className="btn-round"
                      color="primary"
                      href="#"
                      onClick={this.callAPIs}
                      >Search</Button>
              </div>
              <h4>Checkouts Over Time</h4>
              {borrowingTrendsChart}
              <h4>New York Times Rankings</h4>
              {rankingsChart}
            </Container>
          </div>
        );
      }
    }


export default BorrowingTrends;
