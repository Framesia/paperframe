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
    data: []
  };
  componentDidMount() {
    PostStore.getPost({
      sortBy: "trending",
      query: {
        tag: "science",
        limit: 5,
        truncate_body: 1
      }
    });
    // client.database
    //   .getDiscussions("trending", {
    //     tag: "science",
    //     limit: 5,
    //     truncate_body: 1
    //   })
    //   .then(data => {
    //     console.log(data);
    //     this.setState({ data });
    //   });
  }

  render() {
    const posts = PostStore.selectPosts({
      sortBy: "trending",
      tag: "science"
    });
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
            return <Card data={item} />;
          })}
        </Container>
      </Wrapper>
    );
  }
}

export default view(Feed);
