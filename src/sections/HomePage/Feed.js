import React, { Component } from "react";
import styled from "styled-components";

import Card from "../../components/Card";

import { view } from "react-easy-state";
import PostStore from "../../stores/Post";
import AuthStore from "../../stores/Auth";

const Wrapper = styled.div`
  padding: 0 20px;
`;
const Container = styled.div`
  width: 560px;
  margin: 0 auto;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  border-bottom: solid 1px #eee;
`;
const Heading = styled.h2`
  font-family: "Josefin Slab", serif;
  flex: 1;
  margin: 20px 0;
`;
const SortBy = styled.div``;

class Feed extends Component {
  state = {
    haveFetched: false,
    data: []
  };

  componentDidMount() {
    if (!AuthStore.isLogin) {
      this.fetchPost();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLogin === false && nextProps.isLogin) {
      this.fetchPost();
    }
  }

  fetchPost = () => {
    PostStore.getPost({
      sortBy: "trending",
      query: {
        tag: "",
        limit: 5,
        truncate_body: 1
      }
    });
  };

  render() {
    const posts = PostStore.selectPosts({
      sortBy: "trending",
      tag: ""
    });

    console.log(this.props.isLogin);

    return (
      <Wrapper>
        <Container>
          <Header>
            <Heading>Science</Heading>
            <SortBy>Trending</SortBy>
          </Header>
          {posts.map(item => {
            if (!item) {
              return null;
            }
            return <Card data={item} key={item.id} />;
          })}
        </Container>
      </Wrapper>
    );
  }
}

export default view(Feed);
