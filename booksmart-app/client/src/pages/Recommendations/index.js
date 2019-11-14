import React, { Component } from "react";


class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.callAPI = this.callAPI.bind(this);
        this.state = { recommendations: [] };
    }

    callAPI() {
        fetch("/recommendations/hardcover-fiction/10")
            .then(res => res.json())
            .then(data => this.setState({ recommendations: data }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
        console.log(this.state.recommendations);
    }

    render() {
        const recommendations = this.state.recommendations.map( (rec, index) => {
            return <tr key={ index }><td>{rec.TITLE}</td><td>{rec.DESCRIPTION}</td></tr>
        });
        return (
            <div>
              <table align="center">
                <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
                </thead>
                <tbody>
                  {recommendations}
                </tbody>
              </table>
            </div>
        );
    }
}

export default Recommendations;
