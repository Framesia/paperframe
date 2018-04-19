import React, { Component } from "react";
import styled from "styled-components";

import Button from "../../components/Button";

import { Link } from "react-router-dom";

import steemconnect from "../../helpers/steemconnect";

import { view } from "react-easy-state";
import AuthStore from "../../stores/Auth";

const Wrapper = styled.div`
  padding: 0 20px;
  background: #fff;
  /* border-bottom: solid 1px #eee; */
  /* background: #333;
  color: #eee; */
`;
const LogoText = styled(Link)`
  font-family: "Josefin Slab", serif;
  font-size: 28px;
  text-decoration: none;
  /* color: #eae6ff; */
`;
const Container = styled.div`
  height: 50px;
  width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

class Header extends Component {
  componentDidMount() {
    // AuthStore.getLoginURL();
    // if (AuthStore.getAccessToken()) {
    //   AuthStore.getMe();
    // }
  }
  renderWhenLogin() {
    return <div>{AuthStore.me.name}</div>;
  }
  renderWhenNotLogin() {
    return (
      <div>
        <a href={AuthStore.loginURL}>
          <Button>Login with STEEM</Button>
        </a>
        <Button type="green">Sign up</Button>
      </div>
    );
  }
  render() {
    return (
      <Wrapper>
        <Container>
          <LogoText to="/">Framesia</LogoText>
          {AuthStore.isLogin
            ? this.renderWhenLogin()
            : this.renderWhenNotLogin()}
        </Container>
      </Wrapper>
    );
  }
}

export default view(Header);
