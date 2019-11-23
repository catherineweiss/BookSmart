import React, { Component } from "react";

// reactstrap components
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,

} from "reactstrap";

class ListDropdown extends Component {

  constructor(props) {
    super(props);
    this.callAPI = this.callAPI.bind(this);
    this.state = { lists: [], listname: "Hardcover Fiction", open: false }
  }

  callAPI() {
    const endpoint = `/bestsellers/getlists`;
      fetch(endpoint)
          .then(res => res.json())
          .then(data => this.setState({ lists: data }))
          .catch(err => err);
  }

  componentDidMount() {
    this.callAPI();
    console.log(this.state.lists);
  }

  render() {
    const nytimeslists = this.state.lists.map( (obj, index) => {
      return (
        <DropdownItem key={index} onClick={this.props.handleClick.bind(this)} value={obj.LIST_NAME}>
          {obj.LIST_NAME}
        </DropdownItem>
      );
    });

      return (
        <Dropdown isOpen={this.state.open} toggle={() => { this.setState({ open: !this.state.open }); }}>
          <DropdownToggle
              aria-expanded={false}
              aria-haspopup={true}
              caret
              color="primary"
              data-toggle="dropdown"
              id="dropdownMenuButton"
              type="button"
          >
              {this.props.listname}
          </DropdownToggle>
          <DropdownMenu
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
                      maxHeight: 150,
                    },
                  };
                },
              },
            }}
          >
            {nytimeslists}
          </DropdownMenu>
        </Dropdown>
      );
  }
}

export default ListDropdown;
