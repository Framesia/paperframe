import React, { Component } from "react";

import styled from "styled-components";
import { view } from "react-easy-state";
import { Helmet } from "react-helmet";

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
        <Helmet>
          <title>Framesia - Frame your thought and get rewards.</title>
          <meta
            name="description"
            content="Framesia is a platform where users are rewarded for sharing their voice. It is free to post, comment, & vote on content. You might even get paid for it!"
          />

          {/* <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@publisher_handle" />
          <meta name="twitter:title" content="Page Title" />
          <meta
            name="twitter:description"
            content="Page description less than 200 characters"
          />
          <meta name="twitter:creator" content="@author_handle" />
          <meta
            name="twitter:image"
            content="http://www.example.com/image.jpg"
          />

          <meta property="og:title" content="Title Here" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="http://www.example.com/" />
          <meta property="og:image" content="http://example.com/image.jpg" />
          <meta property="og:description" content="Description Here" />
          <meta property="og:site_name" content="Site Name, i.e. Moz" />
          <meta property="fb:admins" content="Facebook numeric ID" /> */}
        </Helmet>
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
                <div>first time...</div>
              ) : (
                <div>loading...</div>
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
