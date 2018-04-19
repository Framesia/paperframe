import React, { Component } from "react";
import styled from "styled-components";

import Icon from "../../components/Icon";
import { Client } from "dsteem";

const client = new Client("https://api.steemit.com");

const Wrapper = styled.div`
  padding: 0 20px;
`;
const Container = styled.div`
  width: 560px;
  margin: 0 auto;
  /* display: flex; */
  /* justify-content: space-between; */
`;
// const LeftSection = styled.div`
//   width: 540px;
//   border-top: solid 2px #eee;
// `;
const Card = styled.div`
  padding: 20px 0;
  border-bottom: solid 1px #eee;
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
`;
const LeftCard = styled.div`
  /* width: 400px; */
  margin-right: 20px;
  /* flex: 0 0 auto; */
  flex: 1 1 auto;
`;
const RightCard = styled.div`
  width: 160px;
  /* height: auto; */
  display: flex;
  flex: 0 0 auto;
  background: #f6f6f6;
`;
const Title = styled.h3`
  margin: 10px 0;
  font-size: 22px;
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
  /* align-items: center; */
  margin-right: 16px;
  svg {
    position: relative;
    top: -3px;
  }
`;
const Comment = styled.div`
  display: flex;
  /* align-items: center; */
  margin-right: 16px;
  flex: 1;
`;
const Earning = styled.div`
  display: flex;
  /* align-items: center; */
`;
const Text = styled.div`
  /* font-size: 0em; */
  padding-top: 1px;
  /* color: #999; */
  margin-right: 4px;
  margin-left: 2px;
  /* color: #61e0af; */
`;
const Head = styled.div`
  display: flex;
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 0.2em;
`;
const Category = styled.div`
  border-bottom: solid 1px #aaa;
  /* font-weight: bold; */
`;
const Time = styled.div`
  /* border-bottom: solid 1px #ddd; */
  margin-left: 10px;
`;
class Feed extends Component {
  state = {
    data: []
  };
  componentDidMount() {
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
    return (
      <Wrapper>
        <Container>
          <Header>
            <Heading>Science</Heading>
            <SortBy>Trending</SortBy>
          </Header>
          {[0, 1, 2, 3, 4].map(item => (
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
                    <Text>$520.50</Text>
                  </Earning>
                </User>
                {/* <SubTitle>
                    Hiccup (Jay Baruchel) is a Norse teenager from the island of
                    Berk, where fighting dragons is a way of life.
                  </SubTitle> */}
              </LeftCard>
              <RightCard>
                {/* {JSON.parse(item.json_metadata).image && (
                    <Img
                      src={
                        "https://steemitimages.com/160x200/" +
                        JSON.parse(item.json_metadata).image[0]
                      }
                    />
                  )} */}
              </RightCard>
            </Card>
          ))}
        </Container>
      </Wrapper>
    );
  }
}

export default Feed;
