import React, { Component } from "react";
import Datetime from "react-datetime";

import NumOfRowsDropdown from "components/NumOfRowsDropdown";
// reactstrap components
import {
    Button,
    Container,
    Row,
    Col
} from "reactstrap";
import moment from "moment";

class InventoryManager extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { inventory: [], startDate: moment(), endDate: new moment(), numOfResults: 25 };
    }

    callAPI() {
        const startDate = this.state.startDate.format("YYYY-MM-DD");
        const endDate = this.state.endDate.format("YYYY-MM-DD");
        const numOfResults = this.state.numOfResults;

        console.log(startDate);
        console.log(endDate);
        console.log(numOfResults);
        const url = "/inventory/"+startDate+"/"+endDate+"/"+numOfResults;

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ inventory: data }))
            .catch(err => err);
    }

    onChangeStartDate = date => this.setState({ startDate: date });
    onChangeEndDate = date => this.setState({ endDate:date });


    onChangeNumOfResults(event) {
        this.setState({ numOfResults: event.target.value });
    }

    componentDidMount() {
    }

    render() {
        const inventory = this.state.inventory.map( (inventory, index) => {
            return <Row key={index}>
                <Col md="8">
                    <p>{inventory.TITLE}</p>
                </Col>

                <Col md="2">
                    <p>{inventory.ITEM_COUNT}</p>
                </Col>

                <Col md="2">
                    <p>{inventory.CHECKOUT_COUNT}</p>
                </Col>
            </Row>
        });
        return (
            <div>
                <Container>
                    <h3 className="title">Inventory Manager</h3>
                    <Row id="inventory">
                        <Col md="12">
                            <Row id="inventory-date">
                                <Col md="6">
                                    <h4>Start Date</h4>
                                    <Row>
                                        <Col md="6">
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
                                <Col md="6">
                                    <h4>End Date</h4>
                                    <Row>
                                        <Col md="6">
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
                            {inventory}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default InventoryManager;