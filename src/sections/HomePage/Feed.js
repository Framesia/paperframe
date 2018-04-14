import React, { Component } from "react";
import styled from "styled-components";

import { Client } from "dsteem";
const client = new Client("https://api.steemit.com");

const Wrapper = styled.div`
  padding: 0 20px;
`;
const Container = styled.div`
  width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;
const LeftSection = styled.div`
  width: 560px;
  border-top: solid 2px #eee;
`;
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
  padding: 10px 0;
`;
const Ava = styled.div`
  height: 24px;
  width: 24px;
  background: #eee;
  border-radius: 10px;
  margin-right: 10px;
`;
const Username = styled.span`
  font-size: 14px;
  opacity: 0.7;
`;

class Feed extends Component {
  state = {
    data: []
  };
  componentDidMount() {
    client.database
      .getDiscussions("trending", {
        tag: "space",
        limit: 5,
        truncate_body: 1
      })
      .then(data => {
        console.log(data);
        this.setState({ data });
      });
  }
  render() {
    return (
      <Wrapper>
        <Container>
          <LeftSection>
            {this.state.data.map(item => (
              <Card>
                <LeftCard>
                  <Title>{item.title}</Title>
                  {/* <SubTitle>
                    Hiccup (Jay Baruchel) is a Norse teenager from the island of
                    Berk, where fighting dragons is a way of life.
                  </SubTitle> */}
                  <User>
                    <Ava />
                    <Username>{item.author}</Username>
                  </User>
                </LeftCard>
                <RightCard>
                  {JSON.parse(item.json_metadata).image && (
                    <Img
                      src={
                        "https://steemitimages.com/160x200/" +
                        JSON.parse(item.json_metadata).image[0]
                      }
                    />
                  )}
                </RightCard>
              </Card>
            ))}
          </LeftSection>
        </Container>
      </Wrapper>
    );
  }
}

export default Feed;
