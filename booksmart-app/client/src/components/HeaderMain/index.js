import React, { Component } from "react";

class HeaderMain extends Component {

    render() {
        return (
            <div style={{display: "flex", flexDirection: "row"}}>
                <div><a href="/index">Homepage</a></div>
                <div> &nbsp;|&nbsp; </div>
            </div>
        )
    }
}

export default HeaderMain;