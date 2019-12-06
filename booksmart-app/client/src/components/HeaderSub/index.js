import React, { Component } from "react";

class HeaderSub extends Component {

    render() {
        return (
            <div style={{display: "flex", flexDirection: "row"}}>
                <div><a href="/index">Homepage</a></div>
                <div> &nbsp;|&nbsp; </div>
                <div><a href="/reader-dashboard">Reader Dashboard</a></div>
                <div> &nbsp;|&nbsp; </div>
                <div><a href="/librarian-dashboard">Librarian Dashboard</a></div>
            </div>
        )
    }
}

export default HeaderSub;