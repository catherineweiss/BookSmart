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
import BorrowingTrendsGraph from 'components/BorrowingTrendsGraph';
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
        this.state = { borrowingTrends: [], rankingTrends: [], title: '', validTitle: false, error: '' };
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
        callCheckoutsAPI();
        callRankingsAPI();
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
        let results;

        const borrowingTrends = this.state.borrowingTrends.map( (borrowingTrends, index) => {
            return <Row key={index}>
                <Col md="8">
                    <p>{borrowingTrends.TITLE}</p>
                </Col>

                <Col md="2">
                    <p>{borrowingTrends.GENRE}</p>
                </Col>

                <Col md="1">
                    <p>{borrowingTrends.ITEM_COUNT}</p>
                </Col>

                <Col md="1">
                    <p>{borrowingTrends.CHECKOUT_COUNT}</p>
                </Col>
            </Row>
        });

        if(this.state.borrowingTrends.length !== 0) {
            results =
             <Row id="results">
                <Col md="12">
                    <Row id="result-header">
                        <Col md="8">
                            <h5>Title</h5>
                        </Col>

                        <Col md="2">
                            <h5>Genre</h5>
                        </Col>

                        <Col md="1">
                            <h5>Item Count</h5>
                        </Col>

                        <Col md="1">
                            <h5>Checkout Count</h5>
                        </Col>
                    </Row>
                    {trends}
                </Col>
            </Row>;
        }
        else {
            results = '';
        }

        return (
            <div>
                <Container>
                    <h3 className="title">Borrowing Trends</h3>
                    <Row id="borrowing-trend">
                        <Col md="12">
                            <Row id="input-group">
                                <Col md="6">
                                    <h4>Title</h4>
                                    <Row>
                                        <Col md="6">
                                            <div className="input-title">
                                                <FormGroup>
                                                    <Input
                                                        placeholder="Book Title"
                                                        type="text"
                                                        value={this.state.title}
                                                        onChange={this.onChangeTitle}
                                                    ></Input>
                                                    <span style={{color: "red"}}>{this.state.error}</span>
                                                </FormGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md="6">
                                    <Row>
                                        <Col md="6">
                                            <div className="submit">
                                                    <Button
                                                        disabled={!this.state.validTitle}
                                                        className="btn-round"
                                                        color="primary"
                                                        href="#"
                                                        onClick={this.callAPIs}
                                                    >Search</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="space-50"></div>
                    {const LineChart = ({data}) =>
                        <C3Chart data = {{json: data}} />;
                    const chartData = {
                        line: {
                            data1: borrowingTrends.CHECKOUTS_PER_MONTH;
                        }
                    }
                    ReactDom.render(
                        <div>
                            <LineChart data = {chartData.line} />
                        </div>, document.getElementbyId('react-c3js')
                    )
                    }
                </Container>
            </div>
        );
    }
}

export default BorrowingTrends;
