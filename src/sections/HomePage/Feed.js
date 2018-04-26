import React, { Component } from "react";
import styled from "styled-components";

import Card from "../../components/Card";

import { view } from "react-easy-state";
import PostStore from "../../stores/Post";
import AuthStore from "../../stores/Auth";

const Wrapper = styled.div`
  margin-bottom: 40px;
  border: solid 1px #eee;
`;
const Container = styled.div`
  width: 600px;
  margin: 0 auto;
`;
const Content = styled.div`
  padding: 20px;
  border-top: none;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  border-bottom: solid 1px #eee;
  background: #f6f6f6;
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
      console.log(AuthStore.isLogin);
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
        tag: this.props.tag,
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

    return (
      <Wrapper>
        <Container>
          <Header>
            <Heading>{this.props.tag}</Heading>
          </Header>
          <Content>
            {posts.map(item => {
              if (!item) {
                return null;
              }
              return <Card data={item} key={item.id} />;
            })}
          </Content>
        </Container>
      </Wrapper>
    );
  }
}

export default view(Feed);
