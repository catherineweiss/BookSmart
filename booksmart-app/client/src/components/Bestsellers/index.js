import React, { Component } from "react";
import {
    Button,
    Container,
    Row,
    Col
} from "reactstrap";
import CustomNumOfRowsDropdown from "components/CustomNumOfRowsDropdown";
import HeaderSub from "components/HeaderSub";
import ListDropdown from "components/ListDropdown";


class Bestsellers extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.onChangeListName = this.onChangeListName.bind(this);
        this.onChangeNumOfResults = this.onChangeNumOfResults.bind(this);
        this.state = { bestsellers: [], listname: "Hardcover Fiction", numResults: 5 };
    }

    callAPI() {
      const listname = this.state.listname;
      const numResults = this.state.numResults;
      const endpoint = `/bestsellers/${listname}/${numResults}`;
        fetch(endpoint)
            .then(res => res.json())
            .then(data => this.setState({ bestsellers: data }))
            .catch(err => err);
    }

    onChangeListName(event) {
      this.setState({ listname: event.target.value });
    }

    onChangeNumOfResults(event) {
        this.setState({ numResults: event.target.value });
    }

    render() {
      const leftWidth = 2;
      const midWidth = 1;

      const bestsellers = this.state.bestsellers.map( (bs, index) => {
          // return <tr key={ index }><td>{bs.TITLE}</td><td>{bs.DESCRIPTION}</td></tr>
          return <Row key={index}>
              <Col md="4">
                  <p>{bs.TITLE}</p>
              </Col>
              <Col>
                  <p>{bs.DESCRIPTION}</p>
              </Col>
          </Row>
      });
        return (
          <div>
              <Container>
                <HeaderSub />
                <h3 className="title">Bestsellers</h3>
                <div>Pick your favorite genre, and let us tally the ranks of the New York Times bestseller list  </div>
                <div>  to find the all-time longest-standing bestsellers, along with a description of each book and  </div>
                <div>  how long it was on the list. Helpful to Readers and Librarians alike! </div>
                <div className="space-50"></div>
                <Row id="bestsellers">
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
                    <h4>Bestseller List</h4>
                    <Row>
                      <Col md={leftWidth}>
                        <div className="bestseller-selection" style={{paddingBottom: "10em"}}>
                          <ListDropdown handleClick={this.onChangeListName.bind(this)} listname={this.state.listname} />
                        </div>
                      </Col>
                    </Row>
                    <h4>Number of Titles</h4>
                    <Row>
                      <Col md={leftWidth}>
                        <div className="numTitles-selection">
                          <CustomNumOfRowsDropdown
                            handleClick={this.onChangeNumOfResults.bind(this)}
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
                            <Col md="4">
                                <h5>Title</h5>
                            </Col>
                            <Col>
                                <h5>Description</h5>
                            </Col>
                          </Row>
                          {bestsellers}
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

export default Bestsellers;
