import React, { Component } from "react";

// reactstrap components
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap";

class BestsellerListsDropdown extends Component{
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
                        {this.props.listName}
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuButton">
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Hardcover Fiction">
                            Hardcover Fiction
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Trade Fiction Paperback">
                            Trade Fiction Paperback
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Hardcover Nonfiction">
                            Hardcover Nonfiction
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Paperback Nonfiction">
                            Paperback Nonfiction
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Young Adult">
                            Young Adult
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Chapter Books">
                            Chapter Books
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Series Books">
                            Series Books
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Picture Books">
                            Picture Books
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </>
        );
    }
}

export default BestsellerListsDropdown;
