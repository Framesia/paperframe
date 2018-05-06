import React, { Component } from "react";
import styled from "styled-components";

import sentenceCase from "sentence-case";

import { view } from "react-easy-state";
import { StickyContainer, Sticky } from "react-sticky";
import { Link } from "react-router-dom";

import PostStore from "../../stores/Post";
import AuthStore from "../../stores/Auth";

import Card from "../../components/Card";
import Button from "../../components/Button";
import FeedLoading from "./FeedLoading";

const Wrapper = styled.div`margin-bottom: 40px;`;
const Container = styled.div`
  width: 600px;
  margin: 0 auto;
  @media only screen and (max-width: 1000px) {
    width: 100%;
  }
`;
const Content = styled.div`
  padding: 0 20px;
  border: solid 1px #eee;
  border-top: none;
  width: 100%;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: solid 1px #eee;
  background: #e3fcef;
  z-index: 5;
  height: 60px;
`;
const Heading = styled.h3`
  font-family: "Josefin Slab", serif;
  padding: 20px;
  margin: 0;
  font-weight: bold;
  /* flex: 1; */
`;
const SortBy = styled.div``;
const LoadMoreWrapper = styled.div`
  padding: 10px 0;
  text-align: center;
`;

class Feed extends Component {
  state = {};

  componentDidMount() {
    console.log(AuthStore.loading);
    if (!AuthStore.loading) {
      this.fetchPost({ username: this.props.username });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLogin === false && nextProps.isLogin) {
      this.fetchPost({ username: nextProps.username });
    } else if (this.props.username !== nextProps.username) {
      this.fetchPost({ username: nextProps.username });
    }
  }

  fetchPost = ({ username, start_author, start_permlink }) => {
    console.log("test");
    let query = {
      tag: username,
      limit: 5,
      truncate_body: 1
    };
    if (start_author && start_permlink) {
      query.start_author = start_author;
      query.start_permlink = start_permlink;
      query.limit = 6;
    }
    PostStore.getPosts({
      sortBy: "blog",
      query
    });
  };

  render() {
    const posts = PostStore.selectPosts({
      sortBy: "blog",
      tag: this.props.username
    });
    const loading = PostStore.selectLoading({
      sortBy: "blog",
      tag: this.props.username
    });

    return (
      <Wrapper>
        <Container>
          <StickyContainer>
            <Sticky>
              {({ style }) => {
                return (
                  <Header style={{ ...style }}>
                    <Heading>@{this.props.username}</Heading>
                  </Header>
                );
              }}
            </Sticky>
            <Content>
              {posts.map(item => {
                if (!item) {
                  return null;
                }
                return <Card data={item} key={item.id} />;
              })}
              {!loading && posts.length > 0 && posts.length % 5 === 0 ? (
                <LoadMoreWrapper>
                  <Button
                    type="blue"
                    onClick={() => {
                      this.fetchPost({
                        username: this.props.username,
                        start_author: posts[posts.length - 1].author,
                        start_permlink: posts[posts.length - 1].permlink
                      });
                    }}
                  >
                    Load more
                  </Button>
                </LoadMoreWrapper>
              ) : null}
              {loading && (
                <React.Fragment>
                  {[0].map(i => {
                    return <FeedLoading key={i} />;
                  })}
                </React.Fragment>
              )}
            </Content>
          </StickyContainer>
        </Container>
      </Wrapper>
    );
  }
}

export default view(Feed);
