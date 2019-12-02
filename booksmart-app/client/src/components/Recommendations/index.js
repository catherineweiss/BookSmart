import React, { Component } from "react";
import ReadMore from './ReadMore';

import {
  Button,
  Col,
  Container,
  Input,
  Row
} from "reactstrap";
import CustomNumOfRowsDropdown from "components/CustomNumOfRowsDropdown";
import HeaderSub from "components/HeaderSub";


class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChangeNumOfResults = this.onChangeNumOfResults.bind(this);
        this.state = { recommendations: [], title: "", numResults: 5 };
    }

    callAPI() {
      const title = this.state.title;
      const numResults = this.state.numResults;
      const endpoint = `/recommendations/${title}/${numResults}`;
        fetch(endpoint)
            .then(res => res.json())
            .then(data => this.setState({ recommendations: data }))
            .catch(err => err);
    }

    handleChange(event) {
      console.log(event.target.value);
      this.setState({title: event.target.value});
    }

    handleTruncate(truncated) {
      this.setState({ truncated: !this.state.truncated });
    }

    onChangeNumOfResults(event) {
        this.setState({ numResults: event.target.value });
    }

    render() {
      const leftWidth = 2;
      const midWidth = 1;

      const recommendations = this.state.recommendations.map( (rec, index) => {
          return <Row key={index}>
              <Col>
                  <p>{rec.TITLE}</p>
              </Col>
              <Col>
                <ReadMore>
                  <p>{rec.DESCRIPTION}</p>
                </ReadMore>
              </Col>
              <Col>
                <p>{rec.AVERAGE_RATING.toString().slice(0,4)}</p>
              </Col>
              <Col>
                <p>{rec.GENRE_NAME}</p>
              </Col>
              <Col>
                <p>{rec.PUBLICATION_YEAR}</p>
              </Col>
          </Row>
      });
        return (
          <div>
              <Container>
                <HeaderSub />
                <h3 className="title">Recommendations</h3>
                <Row id="recommendations">
                  <Col md={leftWidth}>
                    <Row>
                        <Col>
                            <div>
                                <Button
                                    className="btn-round"
                                    color="primary"
                                    href="#"
                                    onClick={this.callAPI}
                                    >Search</Button>
                            </div>
                        </Col>
                    </Row>
                    <h4>Title</h4>
                    <Row>
                      <Col>
                        <div className="title-input">
                        <form onSubmit={this.handleSubmit}>
                          <Input type="text"
                                 value={this.state.title}
                                 onChange={this.handleChange}
                                 style={{ color: "black", width: "90%" }}/>
                        </form>
                        </div>
                      </Col>
                    </Row>
                    <h4>Number of Titles</h4>
                    <Row>
                      <Col md={leftWidth}>
                        <div className="numTitles-selection">
                          <CustomNumOfRowsDropdown
                            handleClick={this.onChangeNumOfResults}
                            numOfResults={this.state.numResults}
                            options={[5, 10, 15, 20]}/>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={midWidth}></Col>
                  <Col>
                    <Row>
                      <Col>
                        <div className="results">
                          <Row id="result-header">
                            <Col>
                                <h5>Title</h5>
                            </Col>
                            <Col>
                                <h5>Description</h5>
                            </Col>
                            <Col>
                              <h5>Average Ratings</h5>
                            </Col>
                            <Col>
                              <h5>Genre</h5>
                            </Col>
                            <Col>
                              <h5>Publication Year</h5>
                            </Col>
                          </Row>
                          {recommendations}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
          </div>
        );
    }
}

export default Recommendations;
