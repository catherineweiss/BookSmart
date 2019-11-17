import React, { Component } from "react";
import Datetime from "react-datetime";

import NumOfRowsDropdown from "components/NumOfRowsDropdown";
// reactstrap components
import {
    Button,
    FormGroup,
    Container,
    Row,
    Col
} from "reactstrap";

class InventoryManager extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { inventory: [] };
    }

    callAPI() {
        // startDate/endDate/numberOfRecords
        fetch("/inventory/2013-01-02/2013-08-02/100")
            .then(res => res.json())
            .then(data => this.setState({ inventory: data }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
        console.log(this.state.inventory);
    }

    render() {
        const inventory = this.state.inventory.map( (inventory, index) => {
            return <Row id="result-row">
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
                                                <FormGroup>
                                                    <Datetime
                                                        timeFormat={false}
                                                        inputProps={{ placeholder: "Start Date" }}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="6">
                                    <h4>End Date</h4>
                                    <Row>
                                        <Col md="6">
                                            <div className="datepicker-container">
                                                <FormGroup>
                                                    <Datetime
                                                        timeFormat={false}
                                                        inputProps={{ placeholder: "End Date" }}
                                                    />
                                                </FormGroup>
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
                                                <FormGroup>
                                                    <NumOfRowsDropdown/>
                                                </FormGroup>
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
