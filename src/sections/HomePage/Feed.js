import React, { Component } from "react";
import styled from "styled-components";

import sentenceCase from "sentence-case";

import { view } from "react-easy-state";
import { StickyContainer, Sticky } from "react-sticky";

import PostStore from "../../stores/Post";
import AuthStore from "../../stores/Auth";

import Card from "../../components/Card";

const Wrapper = styled.div`
  margin-bottom: 40px;
`;
const Container = styled.div`
  width: 600px;
  margin: 0 auto;
`;
const Content = styled.div`
  padding: 0 20px;
  border: solid 1px #eee;
  border-top: none;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  border: solid 1px #eee;
  background: #f6f6f6;
  z-index: 5;
`;
const Heading = styled.h3`
  font-family: "Josefin Slab", serif;
  padding: 20px;
  margin: 0;
  font-weight: bold;
  /* flex: 1; */
`;
const SortBy = styled.div``;

class Feed extends Component {
  state = {
    haveFetched: false,
    data: []
  };

  componentDidMount() {
    if (!AuthStore.isLogin && AuthStore.loading === false) {
      this.fetchPost(this.props.tag);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLogin === false && nextProps.isLogin) {
      this.fetchPost(nextProps.tag);
    } else if (this.props.tag !== nextProps.tag) {
      this.fetchPost(nextProps.tag);
    }
  }

  fetchPost = tag => {
    PostStore.getPosts({
      sortBy: "trending",
      query: {
        tag,
        limit: 5,
        truncate_body: 1
      }
    });
  };

  render() {
    const posts = PostStore.selectPosts({
      sortBy: "trending",
      tag: this.props.tag
    });
    const loading = PostStore.selectLoading({
      sortBy: "trending",
      tag: this.props.tag
    });

    return (
      <Wrapper>
        <Container>
          <StickyContainer>
            <Sticky topOffset={-50} bottomOffset={-100}>
              {({ style }) => {
                // console.log(style);
                return (
                  <Header style={{ ...style, top: 50 }}>
                    <Heading>{sentenceCase(this.props.tag)}</Heading>
                  </Header>
                );
              }}
            </Sticky>
            <Content>
              {loading && <div>Loading...</div>}
              {!loading &&
                posts.map(item => {
                  if (!item) {
                    return null;
                  }
                  return <Card data={item} key={item.id} />;
                })}
            </Content>
          </StickyContainer>
        </Container>
      </Wrapper>
    );
  }
}

export default view(Feed);
