import React, { Component } from "react";
import styled from "styled-components";

import Button from "../../components/Button";

import { Link, withRouter } from "react-router-dom";

import steemconnect from "../../helpers/steemconnect";

import { view } from "react-easy-state";
import AuthStore from "../../stores/Auth";

import AfterLogin from "./AfterLogin";
// import FramesiaLogo from "./framesia-logo.png";

import root from "window-or-global";

const Wrapper = styled.div`
  padding: 0 20px;
  background: #fff;
  position: fixed;
  width: 100%;
  z-index: 9;
  top: ${({ hide }) => (hide ? -60 : 0)}px;
  transition: top 0.3s;
  /* border-bottom: solid 1px #eee; */
  /* background: #333;
  color: #eee; */
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
`;
const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 12px;
`;
const LogoText = styled(Link)`
  font-family: "Josefin Slab", serif;
  font-size: 28px;
  text-decoration: none;
  position: relative;
  top: 2px;
  /* color: #eae6ff; */

  @media only screen and (max-width: 660px) {
    display: none;
  }
`;
const Container = styled.div`
  height: 60px;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Slip = styled.div`height: 60px;`;

class Header extends Component {
  state = {
    headerHide: false
  };
  componentDidMount() {
    let prevScrollY = 0;
    root.addEventListener("scroll", e => {
      const { scrollY } = root;
      if (prevScrollY >= scrollY || scrollY <= 60) {
        this.setState({ headerHide: false });
      } else {
        this.setState({ headerHide: true });
      }
      prevScrollY = scrollY;
    });

    AuthStore.getLoginURL();
    if (AuthStore.getAccessToken()) {
      AuthStore.getMe();
      if (root.location.search.length > 1) {
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
        <a href="https://signup.steemit.com/" target="_blank">
          <Button type="green">Sign up</Button>
        </a>
      </div>
    );
  }
  render() {
    return (
      <React.Fragment>
        <Wrapper hide={this.state.headerHide}>
          <Container>
            <Logo>
              <Link to="/">
                {/*<LogoImg src={FramesiaLogo} />*/}
                <LogoImg />
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
