import React, { Component } from "react";
import { view } from "react-easy-state";
import styled from "styled-components";

import UserStore from "../stores/User";
import AuthStore from "../stores/Auth";

import UserFeed from "../sections/Feed/UserFeed";

import UserDetail from "../sections/UserPage/UserDetail";

const WrapContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
`;

const Content = styled.div`
  padding: 20px 0;
  width: 100%;
  max-width: 600px;
`;

class UserPage extends Component {
  componentDidMount() {
    const { username } = this.props.match.params;
    UserStore.getUser({ username });
  }

  render() {
    const { username } = this.props.match.params;
    return (
      <WrapContent>
        <Content>
          <UserFeed isLogin={AuthStore.isLogin} username={username} />
        </Content>
        <UserDetail username={username} />
      </WrapContent>
    );
  }
}

export default view(UserPage);
