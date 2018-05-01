import React, { Component } from "react";
import styled from "styled-components";

import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";

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
  padding: 6px 16px;
  font-size: 12px;
  color: #777;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #deebff;
    color: #333;
  }
`;
const DropdownWrapper = styled.div`
  position: relative;
  background: #fff;
  margin-left: -50px;
  border: solid 1px #eee;
  border-radius: 2px;

  a {
    text-decoration: none;
  }
`;

class AfterLogin extends Component {
  render() {
    let { profile } = this.props.me.json_metadata;
    if (!profile) {
      profile = {
        profile_image:
          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
      };
    }
    return (
      <div>
        <Link to={`/write`}>
          <Button type="green" style={{ padding: "4px 10px", marginRight: 10 }}>
            Write
          </Button>
        </Link>
        <Dropdown
          dropdown={
            <DropdownWrapper>
              <Link to={`/@${this.props.me.name}`}>
                <DropItem>My profile</DropItem>
              </Link>
              <DropItem>Topics</DropItem>
              <DropItem>Bookmarks</DropItem>
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
