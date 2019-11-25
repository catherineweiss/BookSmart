import React, { Component } from "react";

// reactstrap components
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap";

class GenreDropdown extends Component{

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
                        {this.props.genre}
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuButton">
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Childrens">
                            Childrens
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Fiction">
                            Fiction
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Graphic">
                            Graphic
                        </DropdownItem>
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Nonfiction">
                            Nonfiction
                        </DropdownItem>                        
                        <DropdownItem onClick={this.props.handleClick.bind(this)} value="Young Adult">
                            Young Adult
                        </DropdownItem>                    
                    </DropdownMenu>
                </UncontrolledDropdown>
            </>
        );
    }
}

export default GenreDropdown;