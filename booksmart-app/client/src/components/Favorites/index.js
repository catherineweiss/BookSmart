import React, { Component } from "react";
import HeaderSub from "components/HeaderSub";
// reactstrap components
import {
    Container,
    Row,
    Col,
    Button
} from "reactstrap";

class Favorites extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { favoriteBooks: [] };

        this.callAPI();
    }

    callAPI() {
        const url = "/favorites";

        fetch(url)
            .then(res => res.json())
            .then(data => this.setState({ favoriteBooks: data }))
            .catch(err => err);
    }

    render() {
        let results;

        const favoriteBooks = this.state.favoriteBooks.map( (books, index) => {
            return <Row key={index}>
                <Col md="12">
                    <p>{books.TITLE}</p>
                </Col>
            </Row>
        });

        if(this.state.favoriteBooks.length !== 0) {
            results =
                <Row id="results">
                    <Col md="12">
                        <Row id="result-header">
                            <Col md="12">
                                <h5>Title</h5>
                            </Col>
                        </Row>
                        {favoriteBooks}
                    </Col>
                </Row>;
        }
        else {
            results = '';
        }

        return (
            <div>
                <Container>
                    <HeaderSub />
                    <h3 className="title">
                        <Button className="btn-icon btn-round" color="primary" type="button">
                            <i className="now-ui-icons ui-2_favourite-28"></i>
                        </Button>
                        Favorites
                    </h3>
                    <div className="space-50"></div>
                    {results}
                </Container>
            </div>
        );
    }
}

export default Favorites;
