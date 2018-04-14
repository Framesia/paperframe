import React, { Component } from "react";
import styled from "styled-components";

import Button from "../components/Button";

import steemconnect from "../helpers/steemconnect";

const Wrapper = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: solid 1px #999;
  border-bottom: solid 1px #999;
  color: #eee;
  padding: 0 20px;
  /* font-family: "Crimson Text", serif; */
  background: #333;
`;

class Header extends Component {
  onLogin = () => {
    console.log(steemconnect().getLoginURL());
  };
  render() {
    return (
      <Wrapper>
        Header
        <Button onClick={this.onLogin}>Sign in</Button>
      </Wrapper>
    );
  }
}

export default Header;
