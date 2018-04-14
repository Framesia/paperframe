import React, { Component } from "react";
import styled from "styled-components";

import Button from "../../components/Button";

import steemconnect from "../../helpers/steemconnect";

import { view } from "react-easy-state";
import AuthStore from "../../stores/Auth";

const Wrapper = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  padding: 0 20px;
  background: #fff;
  border-bottom: solid 1px #eee;
`;

class Header extends Component {
  componentDidMount() {
    AuthStore.getLoginURL();
    if (AuthStore.getAccessToken()) {
      AuthStore.getMe();
    }
  }
  renderWhenLogin() {
    return <div>{AuthStore.me.name}</div>;
  }
  renderWhenNotLogin() {
    return <a href={AuthStore.loginURL}>Sign in</a>;
  }
  render() {
    return (
      <Wrapper>
        {AuthStore.isLogin ? this.renderWhenLogin() : this.renderWhenNotLogin()}
      </Wrapper>
    );
  }
}

export default view(Header);
