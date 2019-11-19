import React, { Component } from "react";
import Datetime from "react-datetime";

import NumOfRowsDropdown from "components/NumOfRowsDropdown";
import YearDropdown from "components/YearDropdown";
import BestsellerListsDropdown from "components/BestsellerListsDropdown";

// reactstrap components
import {
    Button,
    Container,
    Row,
    Col
} from "reactstrap";
import moment from "moment";

class DisplayPlanner extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { bookdisplay: [], listName: moment(), year: moment(), numTimes: moment(), numOfResults: 25 };
    }

    callAPI() {
        const listName = this.state.listName;
        const year = this.state.year;
        const numTimes = this.state.numTimes;
        const numOfResults = this.state.numOfResults;

        console.log(listName);
        console.log(year);
        console.log(numTimes);
        console.log(numOfResults);
        const url = "/bookdisplay/"+listName+"/"+year+"/"+numTimes+"/"+numOfResults;

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ bookdisplay: data }))
            .catch(err => err);
    }

    onChangeListName = newListName => this.setState({ listName: newListName }); 
    onChangeYear = newYear => this.setState({ year: newYear });
    onChangeNumTimes = newNumTimes => this.setState({ numTimes: newNumTimes});

    onChangeNumOfResults(event) {
        this.setState({ numOfResults: event.target.value });
    }

    componentDidMount() {
    }

    render() {
        const bookdisplay = this.state.bookdisplay.map( (bookdisplay, index) => {
            return <Row key={index}>
                <Col md="8">
                    <p>{bookdisplay.TITLE}</p>
                </Col>

                <Col md="2">
                    <p>{bookdisplay.ITEM_COUNT}</p>
                </Col>

                <Col md="2">
                    <p>{bookdisplay.CHECKOUT_COUNT}</p>
                </Col>
            </Row>
        });
        return (
            <div>
                <Container>
                    <h3 className="title">Book DisplayPlanner</h3>
                    <h4> Plan your next library book display based on bestselling authors</h4>
                    <Row id="inventory">
                        <Col md="12">
                            <Row id="inventory-date">
                                <Col md="4">
                                    <h5>Choose a Bestseller List</h5>
                                    <Row>
                                        <Col md="4">
                                            <div className="datepicker-container">
                                                    <Datetime
                                                        timeFormat={false}
                                                        inputProps={{ placeholder: "Start Date" }}
                                                        onChange={this.onChangeStartDate}
                                                        value={this.state.startDate}
                                                    />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="4">
                                    <h5>Select Year</h5>
                                    <Row>
                                        <Col md="4">
                                            <div className="datepicker-container">
                                                    <Datetime
                                                        timeFormat={false}
                                                        inputProps={{ placeholder: "End Date" }}
                                                        onChange={this.onChangeEndDate}
                                                        value={this.state.endDate}
                                                    />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="4">
                                    <h5>Minimum number of times author appears on bestseller list</h5>
                                    <Row>
                                        <Col md="4">
                                            <div className="datepicker-container">
                                                    <Datetime
                                                        timeFormat={false}
                                                        inputProps={{ placeholder: "End Date" }}
                                                        onChange={this.onChangeEndDate}
                                                        value={this.state.endDate}
                                                    />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row id="num-of-rows">
                                <Col md="6">
                                    <h4>Num of results</h4>
                                    <Row>
                                        <Col md="6">
                                            <div className="num-of-rows-dropdown">
                                                    <NumOfRowsDropdown handleClick={this.onChangeNumOfResults.bind(this)} numOfResults={this.state.numOfResults}/>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="6">
                                    <Row>
                                        <Col md="6">
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
                        </Col>
                    </Row>
                    <div className="space-50"></div>
                    <Row id="results">
                        <Col md="12">
                            <Row id="result-header">
                                <Col md="8">
                                    <h5>Title</h5>
                                </Col>

                                <Col md="2">
                                    <h5>Item Count</h5>
                                </Col>

                                <Col md="2">
                                    <h5>Checkout Count</h5>
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
