import React, { Component } from "react";
import styled from "styled-components";

import Dropdown from "../../components/Dropdown";
import { Link } from "react-router-dom";
import AuthStore from "../../stores/Auth";

const Ava = styled.img`
  width: 36px;
  height: 36px;
  background: #eee;
  border-radius: 20px;
  border: none;
  outline: none;
  cursor: pointer;
`;

const DropItem = styled.div`
  padding: 6px 12px;
  font-size: 12px;
  /* opacity: 0.7; */
`;
const DropdownWrapper = styled.div`
  position: relative;
  background: #fff;
  margin-left: 50px;
  padding: 5px;
  border: solid 1px #eee;

  a {
    text-decoration: none;
  }
`;

class AfterLogin extends Component {
  render() {
    const { profile } = this.props.me.json_metadata;
    return (
      <div>
        <Dropdown
          dropdown={
            <DropdownWrapper>
              <Link to={`/@${this.props.me.name}`}>
                <DropItem>My profile</DropItem>
              </Link>
              <DropItem onClick={() => AuthStore.doLogout()}>Logout</DropItem>
            </DropdownWrapper>
          }
        >
          <Ava
            src={`https://steemitimages.com/40x40/${profile.profile_image}`}
          />
        </Dropdown>
      </div>
    );
  }
}

export default AfterLogin;
