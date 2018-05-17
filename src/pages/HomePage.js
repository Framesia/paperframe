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
  @media only screen and (max-width: 1000px) {
    flex-direction: column-reverse;
  }
`;

const Content = styled.div`
  padding: 20px 0;
  width: 100%;
`;

class HomePage extends Component {
  render() {
    return (
      <div>
        {/* this still rendered in server */}
        {!AuthStore.getAccessToken(false) && <Landing />}
        <WrapContent>
          <Content>
            {AuthStore.getAccessToken(false) ? (
              AuthStore.me.user_metadata &&
              AuthStore.me.user_metadata.follow_tags &&
              Array.isArray(AuthStore.me.user_metadata.follow_tags) &&
              AuthStore.me.user_metadata.follow_tags.length > 0 ? (
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
