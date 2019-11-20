import React, { Component } from "react";

import BestsellerListsDropdown from "components/BestsellerListsDropdown";
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
        this.state = { bookdisplay: [], listName: 'name of list ', year: '  year  ', numTimes: ' number ', numOfResults: '25 ' };
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

//    onChangeListName = newListName => this.setState({ listName: newListName }); 
//    onChangeYear = newYear => this.setState({ year: newYear });
//    onChangeNumTimes = newNumTimes => this.setState({ numTimes: newNumTimes});

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
                <Col md="2">
                    <p>{bookdisplay.NAME}</p>
                </Col>
                <Col md="2">
                    <p>{bookdisplay.ISBN13}</p>
                </Col>
                <Col md="2">
                    <p>{bookdisplay.NUM_CHECKOUTS}</p>
                </Col>
            </Row>
        });
        return (
            <div>
                <Container>
                    <h3 className="title">Book DisplayPlanner</h3>
                    <h4> Fill your next library display with books by bestselling authors</h4>
                    <div className="space-50"></div>
                    <Row id="inventory">
                        <Col md="12">
                            <Row id="inventory-date">
                                <Col md="4">
                                    <h5>Choose a NYT Bestseller List</h5>
                                    <Row>
                                        <Col md="4">
                                            <div className="bestseller-lists-dropdown">
                                                <BestsellerListsDropdown handleClick={this.onChangeListName.bind(this)} listName={this.state.listName}/>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="4">
                                    <h5>Select Year</h5>
                                    <Row>
                                        <Col md="4">
                                            <div className="year-dropdown">
                                                <YearDropdown handleClick={this.onChangeYear.bind(this)} year={this.state.year} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="4">
                                    <h5>Minimum number of times author appears on bestseller list</h5>
                                    <Row>
                                        <Col md="4">
                                            <div className="num-of-times">
                                                <NumOfTimesDropdown handleClick={this.onChangeNumOfTimes.bind(this)} numTimes={this.state.numTimes} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row id="num-of-rows">
                                <Col md="6">
                                    <h5>Number of results</h5>
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
                                <Col md="6">
                                    <h5>Title</h5>
                                </Col>
                                <Col md="2">
                                    <h5>Author</h5>
                                </Col>
                                <Col md="2">
                                    <h5>ISBN13</h5>
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
