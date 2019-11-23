import React, { Component } from "react";

// reactstrap components
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap";

class NumOfRowsDropdown extends Component{

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
                        {this.props.numOfResults}
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuButton">
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="25">
                            25
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="50">
                            50
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="100">
                            100
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </>
        );
    }
}

export default NumOfRowsDropdown;