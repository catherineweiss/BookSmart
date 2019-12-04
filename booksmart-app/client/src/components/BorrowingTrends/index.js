import React, { Component } from "react";
// reactstrap components
import {
    FormGroup,
    Input,
    Button,
    Container,
    Row,
    Col
} from "reactstrap";
import moment from "moment";
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import lodash from 'lodash';

class BorrowingTrends extends Component {
    constructor(props) {
        super(props);
        this.callCheckoutsAPI = this.callCheckoutsAPI.bind(this);
        this.callRankingsAPI = this.callRankingsAPI.bind(this);
        this.callAPIs = this.callAPIs.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.state = { borrowingTrends: {}, rankingTrends: [], title: 'harry potter and the sorcerer', validTitle: false, error: '' };
        this.callAPIs();
    }

    callCheckoutsAPI() {
        const title = this.state.title;
        console.log(title);
        const url = "/borrowingtrends/" + title;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                // Group records by ISBN
                var dataByIsbn = lodash.groupBy(data, 'ISBN');
                var yearData = [];
                yearData.push('x');

                var checkoutsData = [];
                console.log(dataByIsbn);

                for(let key in dataByIsbn) {
                    const value = dataByIsbn[key];
                    checkoutsData.push(value[0].TITLE);
                    value.map(record => {
                        var dataRecord =  record.YEAR+'-'+record.MONTH+'-01';
                        yearData.push(dataRecord);
                        checkoutsData.push(record.CHECKOUTS_PER_MONTH);
                    });

                    var borrowingTrends = {yearData, checkoutsData};
                    console.log(borrowingTrends);
                    this.setState({ borrowingTrends });
                    break;
                }

            })
            .catch(err => err);


    }

    callRankingsAPI() {
        const title = this.state.title;
        console.log(title);
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
        let borrowingTrendsResults;
        let nytRankingResults;

        //creates the borrowingtrends graph
       let columnData = [];
           if(this.state.borrowingTrends) {
               columnData.push(this.state.borrowingTrends.yearData);
               columnData.push(this.state.borrowingTrends.checkoutsData);
               const data = {
                   x: 'x',
    //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
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
               return (
                   <div>
                       <C3Chart data={data} axis = {axis}/>
                   </div>
               );
       }

    }
}


export default BorrowingTrends;
