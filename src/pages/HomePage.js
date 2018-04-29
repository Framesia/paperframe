import React, { Component } from "react";

import styled from "styled-components";
import { view } from "react-easy-state";

import Landing from "../sections/HomePage/Landing";

import Feed from "../sections/Feed/Feed";

import AuthStore from "../stores/Auth";
import FirstTimeLogin from "../sections/HomePage/FirstTimeLogin";
import Loader from "../components/Loader";
import RecomendedTags from "../sections/HomePage/RecomendedTags";

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
              Array.isArray(AuthStore.me.user_metadata.follow_tags) &&
              AuthStore.me.user_metadata.follow_tags > 0 ? (
                AuthStore.me.user_metadata.follow_tags.map((tag, i) => (
                  <Feed isLogin={AuthStore.isLogin} tag={tag} key={i} />
                ))
              ) : AuthStore.me.user_metadata &&
              (!AuthStore.me.user_metadata.follow_tags ||
                Array.isArray(AuthStore.me.user_metadata.follow_tags)) ? (
                <FirstTimeLogin />
              ) : (
                <Loader />
              )
            ) : (
              <React.Fragment>
                <Feed isLogin={false} tag="science" />
                <Feed isLogin={false} tag="programming" />
              </React.Fragment>
            )}
          </Content>
          <RecomendedTags />
        </WrapContent>
      </div>
    );
  }
}

export default view(HomePage);
