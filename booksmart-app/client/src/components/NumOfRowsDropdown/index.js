import React from "react";

// reactstrap components
import {
    Button,
    ButtonGroup,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap";

function NumOfRowsDropdown(){
    return (
        <>
            <UncontrolledDropdown>
                <DropdownToggle
                    aria-expanded={false}
                    aria-haspopup={true}
                    caret
                    color="secondary"
                    data-toggle="dropdown"
                    id="dropdownMenuButton"
                    type="button"
                >
                    Num of Results
                </DropdownToggle>
                <DropdownMenu aria-labelledby="dropdownMenuButton">
                    <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>
                        25
                    </DropdownItem>
                    <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>
                        50
                    </DropdownItem>
                    <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>
                        100
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </>
    );
}

export default NumOfRowsDropdown;