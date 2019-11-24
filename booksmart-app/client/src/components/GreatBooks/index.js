import React, { Component } from "react";

import GenreDropdown from "components/GenreDropdown";
import NumOfRowsDropdown from "components/NumOfRowsDropdown";

// reactstrap components
import {
    Button,
    Container,
    Row,
    Col
} from "reactstrap";

class GreatBooks extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { books: [], genre: ' book genre ', numOfResults: '25 ' };
    }

    callAPI() {
        const genre = this.state.genre;
        const numOfResults = this.state.numOfResults;

        console.log(genre);
        console.log(numOfResults);
        const url = "/greatbooks/"+genre+"/"+numOfResults;

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ books: data }))
            .catch(err => err);
    }

    onChangeGenre(event) {
        this.setState({ genre: event.target.value });
    }    
    onChangeNumOfResults(event) {
        this.setState({ numOfResults: event.target.value });
    }

    componentDidMount() {
    }

    render() {
        const books = this.state.books.map( (books, index) => {
            return <Row key={index}>
                <Col md="8">
                    <p>{books.TITLE}</p>
                </Col>
                <Col md="4">
                    <p>{books.NUM_CHECKOUTS}</p>
                </Col>
            </Row>
        });
        return (
            <div>
                <Container>
                    <h3 className="title">Great Books You've Never Heard Of</h3> 
                    <Row id="inputs-to-display">
                        <Col md="8">
                            <Row>
                                <Col md="12">
                                    <div>Wondering what to suggest for your next book club selection?</div>
                                    <div>Need to pick out a book for a person who has "read everything"?</div>
                                    <div>This Reader Tool is for you! Find books that were not New York Times</div>
                                    <div>bestsellers, yet racked up the most library checkouts for a particular genre.</div>
                                    <div className="space-50"></div>
                                </Col>
                            </Row>

                            <Row id="genreSelection">
                                <Col md="6">
                                    <h5>Choose a Genre:</h5>
                                </Col>
                                <Col md="6">
                                    <div className="genre-dropdown">
                                        <GenreDropdown handleClick={this.onChangeGenre.bind(this)} genre={this.state.genre}/>
                                    </div> 
                                </Col>
                            </Row>

                            <Row id="num-of-rows">
                                <Col md="6">
                                    <h5>How many results would you like to display?</h5>
                                </Col>
                                <Col md="6">
                                    <div className="num-of-rows-dropdown">
                                        <NumOfRowsDropdown handleClick={this.onChangeNumOfResults.bind(this)} numOfResults={this.state.numOfResults}/>
                                    </div>
                                </Col>
                            </Row>

                        </Col>

                        <Col md="4">
                            <div>Image should go here, but is not displaying</div>
                            <div
                                className="image-container"
                                style={{
                                    backgroundImage:
                                        "url(" + require("assets/image/stack3.jpg") + ")"
                                }}
                            ></div>
                        </Col>

                        <Col md="12">    
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
                        <Col md="12"> <h4>Here are your book ideas:</h4>
                            <Row id="result-header">
                                <Col md="8">
                                    <h5>Title</h5>
                                </Col>
                                <Col md="4">
                                    <h5>Checkout Count, 2013 - 2017</h5>
                                </Col>
                            </Row>
                            {books}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default GreatBooks;
