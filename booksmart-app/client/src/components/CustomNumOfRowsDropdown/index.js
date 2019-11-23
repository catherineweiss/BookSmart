import React, { Component } from "react";

// reactstrap components
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap";

class CustomNumOfRowsDropdown extends Component{

    render() {
        // const {children, ...attributes} = this.props;

        const options = this.props.options.map( (option, index) => {
          return (
            <DropdownItem key={index} onClick={this.props.handleClick.bind(this)} value={option}>
              {option}
            </DropdownItem>
          );
        })

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
                    <DropdownMenu aria-labelledby="dropdownMenuButton"
                      modifiers={{
                        setMaxHeight: {
                          enabled: true,
                          order: 890,
                          fn: (data) => {
                            return {
                              ...data,
                              styles: {
                                ...data.styles,
                                overflow: 'auto',
                                maxHeight: 120,
                              },
                            };
                          },
                        },
                      }}
                    >
                    {options}
                  </DropdownMenu>
                </UncontrolledDropdown>
            </>
        );
    }
}

export default CustomNumOfRowsDropdown;
