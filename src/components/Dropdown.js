import React, { Component } from "react";

import RCDropdown from "rc-dropdown";

class Dropdown extends Component {
  render() {
    return (
      <RCDropdown
        trigger={["click"]}
        overlay={this.props.dropdown}
        overlayClassName="dropdown-items"
        animation="slide-up"
        placement={this.props.placement || "bottomLeft"}
      >
        {this.props.children}
      </RCDropdown>
    );
  }
}

export default Dropdown;
