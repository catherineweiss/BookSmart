import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col
} from "reactstrap";

// core components
import LandingPageHeader from "components/Headers/LandingPageHeader.js";

function LandingPage() {
    return (
        <>
            <div className="wrapper">
                <LandingPageHeader/>
                <div className="section section-about-us">
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto text-center" md="10">
                                <h2 className="title">What is BookSmart?</h2>
                                <h5 className="description">
                                Helping readers and librarians understand patterns and trends 
                                in book borrowing, buying, and popularity. 
                                </h5>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="ml-auto mr-auto text-center" md="8">
                                <h2 className="title">BookSmart Features</h2>
                                <h5 className="description">
                                Are you a librarian? BookSmart provides access to tools designed 
                                to assist with inventory management and book display presentation.  
                                BookSmart gauges the popularity of new releases and books already on 
                                library shelves and identifies books rarely borrowed, as well as providing 
                                a visualization of borrowing trends.</h5> 

                                <h5 className="description">
                                Looking for your next great read? BookSmart aggregates information on book 
                                titles from multiple sources, provide deeper insight into what other people 
                                are reading, and offer book recommendations based on personal preference. 
                                Check it out! 
                                </h5>
                            </Col>
                        </Row>


                        <div className="separator separator-primary"></div>
                        <div className="section-story-overview">
                            <Row>
                                <Col md="6">
                                    <div
                                        className="image-container image-left"
                                        style={{
                                            backgroundImage:
                                                "url(" + require("assets/image/bg1.jpeg") + ")"
                                        }}
                                    >
                                        <p className="blockquote blockquote-info">
                                            "If you only read the books that everyone else is reading, you can only think what everyone else is thinking." <br></br>
                                            <br></br>
                                            <small>-Haruki Murakami</small>
                                        </p>
                                    </div>
                                </Col>
                                <Col md="5">
                                    <div
                                        className="image-container image-right"
                                        style={{
                                            backgroundImage:
                                                "url(" + require("assets/image/bg2.jpeg") + ")"
                                        }}
                                    ></div>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>
                <div className="section section-team text-center">
                    <Container>
                        <h2 className="title">Access Tools</h2>
                        <div className="team">
                            <Row>
                                <Col md="6">
                                    <div className="team-player">
                                        <img
                                            alt="..."
                                            className="rounded img-fluid img-raised"
                                            src={require("assets/image/librarian.jpg")}
                                        ></img>
                                        <a href="/librarian-dashboard">
                                            <h4 className="title">Librarian</h4>
                                        </a>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="team-player">
                                        <img
                                            alt="..."
                                            className="rounded img-fluid img-raised"
                                            src={require("assets/image/reader.jpg")}
                                        ></img>
                                        <a href="reader-dashboard">
                                            <h4 className="title">Reader</h4>
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>
                <Row>
                    <Col className="ml-auto mr-auto text-center" md="10">
                        <div className="copyright">
                            BookSmart relies on three datasets for information: The New York Times Books API
                            for information about book sales, the Goodreads API for information about ratings
                            and reviews, and Seattle Public Library Checkout Records for information about
                            checkouts from a major public library system. In BookSmart v1.0, data is limited to
                            bestseller and library checkout information from 2013 to 2017.
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default LandingPage;
