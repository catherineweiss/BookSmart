import React, { Component } from "react";

// reactstrap components
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap";

class YearDropdown extends Component{

    render() {
        return (
            <>
                <UncontrolledDropdown>
                    <DropdownToggle
                        aria-expanded={false}
                        aria-haspopup={true}
                        caret
                        color="primary"
                        data-toggle="dropdown"
                        id="dropdownMenuButton"
                        type="button"
                    >
                        {this.props.year}
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuButton">
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="2017">
                            2017
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="2016">
                            2016
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="2015">
                            2015
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="2014">
                            2014
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="2013">
                            2013
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </>
        );
    }
}

export default YearDropdown;