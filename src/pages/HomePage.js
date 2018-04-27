import React, { Component } from "react";

import styled from "styled-components";
import { view } from "react-easy-state";

import Header from "../sections/Header/Header";

import Landing from "../sections/HomePage/Landing";
import Sidebar from "../sections/HomePage/Sidebar";

import Feed from "../sections/Feed/Feed";

import AuthStore from "../stores/Auth";

const WrapContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
`;

const Content = styled.div`
  padding: 20px 0;
`;

class HomePage extends Component {
  render() {
    return (
      <div>
        {!AuthStore.getAccessToken() && <Landing />}
        <WrapContent>
          <Content>
            {AuthStore.getAccessToken() ? (
              AuthStore.me.user_metadata &&
              AuthStore.me.user_metadata.follow_tags &&
              Array.isArray(AuthStore.me.user_metadata.follow_tags) ? (
                AuthStore.me.user_metadata.follow_tags.map((tag, i) => {
                  return <Feed isLogin={AuthStore.isLogin} tag={tag} key={i} />;
                })
              ) : (
                <div>Loading...</div>
              )
            ) : (
              <React.Fragment>
                <Feed isLogin={false} tag="science" />
                <Feed isLogin={false} tag="programming" />
              </React.Fragment>
            )}
          </Content>
          <Sidebar />
        </WrapContent>
      </div>
    );
  }
}

export default view(HomePage);
