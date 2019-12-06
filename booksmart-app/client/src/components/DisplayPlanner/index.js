import React, { Component } from "react";

import BestsellerListsDropdown from "components/BestsellerListsDropdown";
import HeaderSub from "components/HeaderSub";
import YearDropdown from "components/YearDropdown";
import NumOfTimesDropdown from "components/NumOfTimesDropdown"
import NumOfRowsDropdown from "components/NumOfRowsDropdown";

// reactstrap components
import {
    Button,
    Container,
    Row,
    Col
} from "reactstrap";

class DisplayPlanner extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { bookdisplay: [], listName: 'name of list ', numTimes: ' number ', year: '  year  ', numOfResults: '25 ' };
    }

    callAPI() {
        const listName = this.state.listName;
        const numTimes = this.state.numTimes;
        const year = this.state.year;
        const numOfResults = this.state.numOfResults;

        console.log(listName);
        console.log(numTimes);
        console.log(year);
        console.log(numOfResults);
        const url = "/bookdisplay/"+listName+"/"+numTimes+"/"+year+"/"+numOfResults;

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ bookdisplay: data }))
            .catch(err => err);
    }

    onChangeListName(event) {
        this.setState({ listName: event.target.value });
    }    
    onChangeYear(event) {
        this.setState({ year: event.target.value });
    }    
    onChangeNumOfTimes(event) {
        this.setState({ numTimes: event.target.value });
    }
    onChangeNumOfResults(event) {
        this.setState({ numOfResults: event.target.value });
    }

    componentDidMount() {
    }

    render() {
        const bookdisplay = this.state.bookdisplay.map( (bookdisplay, index) => {
            return <Row key={index}>
                <Col md="6">
                    <p>{bookdisplay.TITLE}</p>
                </Col>
                <Col md="4">
                    <p>{bookdisplay.NAME}</p>
                </Col>
                <Col md="2">
                    <p>{bookdisplay.NUM_CHECKOUTS}</p>
                </Col>
            </Row>
        });
        return (
            <div>
                <Container>
                <HeaderSub />
                    <h3 className="title">Book Display Planner</h3>                        
                    <div>Fresh out of ideas for your new library display? How about creating your next selection</div>
                    <div>from bestselling authors? With the Book Display Planner, you can specify a genre and the minimum</div>
                    <div>number of times an author has had a book appearing on a New York Times bestseller list. </div>
                    <div>BookSmart will return a list of books by those authors and sort the titles by book borrowing</div>
                    <div>frequency. All the time you save in planning will be spent restocking your popular display!</div>
                    <div className="space-50"></div>
                    <Row id="inputs-to-display">
                        <Col md="12">
                            <Row id="listSelection">
                                <Col md="5">
                                    <h5>Choose a New York Times Bestseller List:</h5>
                                </Col>
                                <Col md="7">
                                    <div className="bestseller-lists-dropdown">
                                                <BestsellerListsDropdown handleClick={this.onChangeListName.bind(this)} listName={this.state.listName}/>
                                    </div> 
                                </Col>
                            </Row>

                            <Row id="numTimesSelection">
                                <Col md="5">
                                    <h5>Set the minimum number of times that the author must appear on the bestseller list from 2013 - 2017:</h5>
                                </Col>
                                <Col md="7">
                                    <div className="num-of-times">
                                        <NumOfTimesDropdown handleClick={this.onChangeNumOfTimes.bind(this)} numTimes={this.state.numTimes} />
                                    </div>
                                </Col>
                            </Row>

                            <Row id="yearSelection">
                                <Col md="5">
                                    <h5>Results will be sorted by library checkout popularity during the year that you select:</h5>
                                </Col>
                                <Col md="7">
                                    <div className="year-dropdown">
                                        <YearDropdown handleClick={this.onChangeYear.bind(this)} year={this.state.year} />
                                    </div>
                                </Col>
                            </Row>

                            <Row id="num-of-rows">
                                <Col md="5">
                                    <h5>How many results would you like to display?</h5>
                                </Col>
                                <Col md="7">
                                    <div className="num-of-rows-dropdown">
                                        <NumOfRowsDropdown handleClick={this.onChangeNumOfResults.bind(this)} numOfResults={this.state.numOfResults}/>
                                    </div>
                                </Col>
                            </Row>

                            
                            <Row id="submit">
                                <Col md="12">
                                    <div className="submit">
                                        <Button
                                            className="btn-round"
                                            color="primary"
                                            href="#"
                                            onClick={this.callAPI}
                                            >Search</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row id="results">
                        <Col md="12"> <h4>Ideas For Your Next Display:</h4>
                            <Row id="result-header">
                                <Col md="6">
                                    <h5>Title</h5>
                                </Col>
                                <Col md="4">
                                    <h5>Author</h5>
                                </Col>
                                <Col md="2">
                                    <h5>Checkout Count During Selected Year</h5>
                                </Col>
                            </Row>
                            {bookdisplay}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default DisplayPlanner;
