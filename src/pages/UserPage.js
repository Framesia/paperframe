import React, { Component } from "react";
import { view } from "react-easy-state";

import UserStore from "../stores/User";

class UserPage extends Component {
  componentDidMount() {
    const { username } = this.props.match.params;
    UserStore.getUser({ username });
  }

  render() {
    return <div>User </div>;
  }
}

export default view(UserPage);
