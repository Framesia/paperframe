import React, { Component } from "react";

import styled from "styled-components";
import { view } from "react-easy-state";

import Header from "../sections/Header/Header";
import Landing from "../sections/HomePage/Landing";
import Feed from "../sections/HomePage/Feed";
import Sidebar from "../sections/HomePage/Sidebar";

import AuthStore from "../stores/Auth";
import { isArray } from "util";

const WrapContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1000px;
  margin: 0 auto;
`;

const Content = styled.div``;

class HomePage extends Component {
  render() {
    return (
      <div>
        {!AuthStore.getAccessToken() && <Landing />}
        <WrapContent>
          <Content>
            {AuthStore.me.user_metadata &&
            AuthStore.me.user_metadata.follow_tags &&
            Array.isArray(AuthStore.me.user_metadata.follow_tags)
              ? AuthStore.me.user_metadata.follow_tags.map((tag, i) => {
                  return <Feed isLogin={AuthStore.isLogin} tag={tag} key={i} />;
                })
              : null}
          </Content>
          <Sidebar />
        </WrapContent>
      </div>
    );
  }
}

export default view(HomePage);
