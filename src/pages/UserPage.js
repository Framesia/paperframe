import React, { Component } from "react";
import { view } from "react-easy-state";
import styled from "styled-components";

import UserStore from "../stores/User";
import PostStore from "../stores/Post";
import UserFeed from "../sections/Feed/UserFeed";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 660px;
  padding: 0 10px;
`;
class UserPage extends Component {
  componentDidMount() {
    const { username } = this.props.match.params;
    UserStore.getUser({ username });
  }

  render() {
    const { username } = this.props.match.params;
    return (
      <div>
        <UserFeed username={username} />
      </div>
    );
  }
}

export default view(UserPage);
