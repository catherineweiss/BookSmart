import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {Button, Col, Container, Row} from "reactstrap";

// core components

function LibrarianDashboard() {
    return (
        <>
            <div className="section section-examples" data-background-color="black">
                <div className="space-50"></div>
                <Container className="text-center">
                    <Row>
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
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
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
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
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
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
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
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
                    </Row>
                </Container>
                <div className="space-50"></div>
                <Container className="text-center">
                    <Row>
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/display-planner" target="_blank">
                                        <img
                                            alt="..."
                                            className="img-raised librarian-dashboard"
                                            src={require("assets/image/planner.jpeg")}
                                        ></img>
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
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
                        <Col md="6">
                            <Row>
                                <Col sm="12" md={{ size: 6, offset: 3 }}>
                                    <a href="/best-sellers" target="_blank">
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
                                        to="/best-sellers"
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

export default LibrarianDashboard;
