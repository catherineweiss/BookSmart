import React, { Component } from "react";

// reactstrap components
import {
    FormGroup,
    Input,
    Button,
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    CardImg
} from "reactstrap";
import HeaderSub from "components/HeaderSub";

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
            return <Col md="4" className="card-col" key={index}>
                    <Card className="card-book">
                        <CardImg variant="top" src={bookBackground.BOOK_IMAGE? bookBackground.BOOK_IMAGE: require("assets/image/bs-logo.png")} className="card-book-image"/>
                        <CardBody>
                            <CardTitle className="card-title-font">{bookBackground.TITLE}</CardTitle>
                            <CardText>
                                {bookBackground.DESCRIPTION}
                            </CardText>
                            <p className="card-text-font">Average Checkout per year: {bookBackground.AVG_CHECKOUT_PER_YEAR}</p>
                            <p className="card-text-font">New York Times Best Ranking: {bookBackground.MIN_RANK}</p>
                            <p className="card-text-font">Maximum # of weeks on New York Times Best Seller List: {bookBackground.MAX_WEEKS_ON_LIST}</p>
                            <p className="card-text-font">Average Rating: {bookBackground.AVERAGE_RATING}</p>
                            <p className="card-text-font">Ratings Count: {bookBackground.RATINGS_COUNT}</p>
                            <p className="card-text-font">Publication Year: {bookBackground.PUBLICATION_YEAR}</p>
                        </CardBody>
                    </Card>
                </Col>
        });

        if(this.state.bookBackground.length !== 0) {
            results =
                <Container>
                    <Row className="card-row">
                        {bookBackground}
                    </Row>
                </Container>
        }
        else {
            results = '';
        }

        return (
            <div>
                <Container>
                    <HeaderSub />
                    <h3 className="title">Book Background</h3>
                    <div>A one-stop resource for getting a multi-faceted view of books. Enter a title of interest and easily search our database to access library checkout
                        statistics, learn how long the title sat on a New York Times bestseller list (if at all), and get actual reader ratings. If available, you’ll even
                        see book cover art and a description. We’ve aggregated the data to give you the full picture.</div>

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
                    {results}
                </Container>
            </div>
        );
    }
}

export default BookBackground;