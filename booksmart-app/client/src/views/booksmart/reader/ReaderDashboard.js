import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {Button, Col, Container, Row} from "reactstrap";

// core components

function ReaderDashboard() {
    return (
        <>
            <div className="section section-examples" data-background-color="black">
                <div className="space-50"></div>
                <Container className="text-center">
                    <Row>
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/book-background" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised reader-dashboard"
                                            src={require("assets/image/book_background.jpg")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/book-background"
                                        outline
                                        tag={Link}
                                    >
                                        Book Background
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/recommendations" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised reader-dashboard"
                                            src={require("assets/image/recommendations.jpg")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/recommendations"
                                        outline
                                        tag={Link}
                                    >
                                        Book Recommender
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <div className="space-50"></div>
                <Container className="text-center">
                    <Row>
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/greatbooks" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised reader-dashboard"
                                            src={require("assets/image/stack1.jpg")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/greatbooks"
                                        outline
                                        tag={Link}
                                    >
                                        Great Books You've Never Heard Of
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/bestsellers" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised reader-dashboard"
                                            src={require("assets/image/best_sellers.jpg")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/bestsellers"
                                        outline
                                        tag={Link}
                                    >
                                        Best Sellers
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default ReaderDashboard;
