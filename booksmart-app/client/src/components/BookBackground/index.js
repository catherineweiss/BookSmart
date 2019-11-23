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

class BookBackground extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.state = { bookBackground: [], title: '', validTitle: false, error: '' };
    }

    callAPI() {
        const title = this.state.title;

        console.log(title);
        const url = "/bookbackground/"+title;

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ bookBackground: data }))
            .catch(err => err);
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

        const bookBackground = this.state.bookBackground.map( (bookBackground, index) => {
            return <Row key={index}>
                <Col md="6">
                    <p>{bookBackground.TITLE}</p>
                </Col>

                <Col md="1">
                    <p>{bookBackground.AVG_CHECKOUT_PER_YEAR}</p>
                </Col>

                <Col md="1">
                    <p>{bookBackground.MIN_RANK}</p>
                </Col>

                <Col md="4">
                    <p>{bookBackground.DESCRIPTION}</p>
                </Col>
            </Row>
        });

        if(this.state.bookBackground.length !== 0) {
            results =
                <Row id="results">
                    <Col md="12">
                        <Row id="result-header">
                            <Col md="6">
                                <h5>Title</h5>
                            </Col>

                            <Col md="1">
                                <h5>Average Checkouts Per Year</h5>
                            </Col>

                            <Col md="1">
                                <h5>Minimum Rank</h5>
                            </Col>

                            <Col md="4">
                                <h5>Description</h5>
                            </Col>
                        </Row>
                        {bookBackground}
                    </Col>
                </Row>;
        }
        else {
            results = '';
        }

        return (
            <div>
                <Container>
                    <h3 className="title">Book Background</h3>
                    <Row id="book-background">
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
                    {results}
                </Container>
            </div>
        );
    }
}

export default BookBackground;