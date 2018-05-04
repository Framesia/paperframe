import React, { Component } from "react";
import styled from "styled-components";

import Button from "../../components/Button";

import { Link, withRouter } from "react-router-dom";

import steemconnect from "../../helpers/steemconnect";

import { view } from "react-easy-state";
import AuthStore from "../../stores/Auth";

import AfterLogin from "./AfterLogin";

const Wrapper = styled.div`
  padding: 0 20px;
  background: #fff;
  position: fixed;
  width: 100%;
  z-index: 4;
  /* border-bottom: solid 1px #eee; */
  /* background: #333;
  color: #eee; */
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
`;
const LogoImg = styled.img`
  width: 36px;
  height: 36px;
  object-fit: contain;
  margin-right: 12px;
`;
const LogoText = styled(Link)`
  font-family: "Josefin Slab", serif;
  font-size: 28px;
  text-decoration: none;
  position: relative;
  top: 5px;
  /* color: #eae6ff; */
`;
const Container = styled.div`
  height: 50px;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Slip = styled.div`
  height: 50px;
`;

class Header extends Component {
  componentWillMount() {
    AuthStore.getLoginURL();
    if (AuthStore.getAccessToken()) {
      AuthStore.getMe();
      if (window.location.search.length > 1) {
        this.props.history.push({
          pathname: "/",
          search: ""
        });
      }
    }
  }
  renderWhenLogin() {
    return <AfterLogin me={AuthStore.me.account} />;
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
      <React.Fragment>
        <Wrapper>
          <Container>
            <Logo>
              <Link to="/">
                <LogoImg src="./framesia-logo.png" />
              </Link>
              <LogoText to="/">Framesia</LogoText>
            </Logo>
            {AuthStore.loading !== true &&
              (AuthStore.isLogin
                ? this.renderWhenLogin()
                : this.renderWhenNotLogin())}
          </Container>
        </Wrapper>
        <Slip />
      </React.Fragment>
    );
  }
}

export default withRouter(view(Header));
