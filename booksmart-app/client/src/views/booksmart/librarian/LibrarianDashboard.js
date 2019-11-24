import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {Button, Col, Container, Row} from "reactstrap";

// core components

function LibrarianDashboard() {
    return (
        <>
            <div className="section section-examples" data-background-color="black">
                <Container className="text-center">
                    <Row>
                        <Col md="4">
                            <Row>
                                <Col sm="4" md={{ size: 6, offset: 3 }}>
                                    <a href="/inventory-manager" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised librarian-dashboard"
                                            src={require("assets/image/inventory_1.png")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4" md={{ size: 6, offset: 4 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/inventory-manager"
                                        outline
                                        tag={Link}
                                    >
                                        Inventory Manager
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="4">
                            <Row>
                                <Col sm="4" md={{ size: 6, offset: 3 }}>
                                    <a href="/borrowing-trends" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised librarian-dashboard"
                                            src={require("assets/image/trends_1.png")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 5 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/borrowing-trends"
                                        outline
                                        tag={Link}
                                    >
                                        Borrowing Trends
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="4">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/display-planner" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised librarian-dashboard"
                                            src={require("assets/image/BookstoreBookDisplay700x400.jpg")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 12, offset: 2 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/display-planner"
                                        outline
                                        tag={Link}
                                    >
                                        Book Display Planner
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
                                    <a href="/bestsellers" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised librarian-dashboard"
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
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/not-read-books" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised librarian-dashboard"
                                            src={require("assets/image/not_read_books.jpg")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 12, offset: 0 }}>
                                    <Button
                                        className="btn-round"
                                        color="default"
                                        to="/not-read-books"
                                        outline
                                        tag={Link}
                                    >
                                        What People Are Not Reading
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

export default LibrarianDashboard;
