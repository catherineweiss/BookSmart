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
//import BorrowingTrendsGraph from 'components/BorrowingTrendsGraph';
import REACTDOM from 'react-dom';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

class BorrowingTrends extends Component {
    constructor(props) {
        super(props);
        this.callCheckoutsAPI = this.callCheckoutsAPI.bind(this);
        this.callRankingsAPI = this.callRankingsAPI.bind(this);
        this.callAPIs = this.callAPIs.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.state = { borrowingTrends: [], rankingTrends: [], title: 'harry potter and the sorcerer', validTitle: false, error: '' };
        this.callAPIs();
    }

    callCheckoutsAPI() {
        const title = this.state.title;
        console.log(title);
        const url = "/borrowingtrends/" + title;

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ borrowingTrends: data }))
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
        //const borrowingTrends = this.state.borrowingTrends.map( (borrowingTrends, index) => {
        const data = {
            x: 'x',
//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
//            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 340, 200, 500, 250, 350]
        ]
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


export default BorrowingTrends;
