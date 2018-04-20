import React, { Component } from "react";
import styled from "styled-components";

import Icon from "../../components/Icon";

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
const Card = styled.div`
  padding: 20px 0;
  border-bottom: solid 1px #eee;
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
`;
const LeftCard = styled.div`
  margin-right: 20px;
  flex: 1 1 auto;
`;
const RightCard = styled.div`
  width: 160px;
  display: flex;
  flex: 0 0 auto;
  background: #f6f6f6;
`;
const Title = styled.h3`
  margin: 10px 0;
  font-size: 20px;
  /* font-weight: normal; */
`;
const SubTitle = styled.div`
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.7;
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const User = styled.div`
  display: flex;
  align-items: center;
  /* padding: 10px 0; */
  font-size: 14px;
  opacity: 0.7;
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
const Username = styled.span``;
const Footer = styled.div`
  display: flex;
`;
const Votes = styled.div`
  display: flex;
  margin-right: 16px;
  svg {
    position: relative;
    top: -3px;
  }
`;
const Comment = styled.div`
  display: flex;
  margin-right: 16px;
  flex: 1;
`;
const Earning = styled.div`
  display: flex;
`;
const Text = styled.div`
  padding-top: 1px;
  margin-right: 4px;
  margin-left: 2px;
`;
const Head = styled.div`
  display: flex;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;
const Category = styled.div`
  border-bottom: solid 1px #aaa;
`;
const Time = styled.div`
  margin-left: 10px;
`;
class Feed extends Component {
  state = {
    data: []
  };
  componentDidMount() {
    PostStore.getPost({
      sortBy: "trending",
      query: {
        tag: "productivity",
        limit: 10,
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
  getCover(metadata) {
    if (metadata.image) {
      return metadata.image[0];
    }
    return "";
  }
  render() {
    const posts = PostStore.selectPosts({
      sortBy: "trending",
      tag: "productivity"
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
            return (
              <Card>
                <LeftCard>
                  <Head>
                    <Category>{item.category || "science"}</Category>
                    <Time>{item.created || "13 april"}</Time>
                  </Head>
                  <Title>{item.title || "How to train your dragon"}</Title>
                  <User>
                    <Username>{item.author || "damaera"}</Username>
                    <Earning>
                      {/* <Icon type="coin" /> */}
                      <Text>{item.pending_payout_value || "240"}</Text>
                    </Earning>
                  </User>
                  {/* <SubTitle>
                    Hiccup (Jay Baruchel) is a Norse teenager from the island of
                    Berk, where fighting dragons is a way of life.
                  </SubTitle> */}
                </LeftCard>
                <RightCard>
                  {this.getCover(item.json_metadata) && (
                    <Img
                      src={
                        "https://steemitimages.com/160x200/" +
                        this.getCover(item.json_metadata)
                      }
                    />
                  )}
                </RightCard>
              </Card>
            );
          })}
        </Container>
      </Wrapper>
    );
  }
}

export default view(Feed);
