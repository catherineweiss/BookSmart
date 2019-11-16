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
                            <Col className="ml-auto mr-auto text-center" md="8">
                                <h2 className="title">What is BookSmart?</h2>
                                <h5 className="description">
                                    BookSmart aggregates data on book sales, library checkouts and reader
                                    reviews/ratings to provide information and insights to two user groups: librarians
                                    and readers. Librarians will use the app to gauge the popularity of new releases and
                                    books already on their shelves, in order to determine how many copies of those books
                                    to purchase for the stacks. Readers will gain deeper insight into what other people
                                    are reading so they can add titles to their reading list. BookSmart’s data tracks
                                    reading habits reflected in a variety of sources, not just recent bestseller lists,
                                    so it can provide a more detailed view into what is being read and talked about.
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
                                            "There is no friend as loyal as a book." <br></br>
                                            <br></br>
                                            <small>-Ernest Hemingway</small>
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
                                        <a href="/librarian">
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
                                        <a href="reader">
                                            <h4 className="title">Reader</h4>
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>
            </div>
        </>
    );
}

export default LandingPage;
