import React, { Component } from "react";
import styled from "styled-components";

import { view } from "react-easy-state";

import { Link } from "react-router-dom";
import PostStore from "../stores/Post";

// import removeMd from "remove-markdown";

const Wrapper = styled.div`
  padding: 12px 0;
  border-bottom: solid 1px #eee;
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
`;
const LeftCard = styled.div`
  margin-right: 20px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const RightCard = styled.div`
  width: 160px;
  display: flex;
  flex: 0 0 auto;
  background: #f6f6f6;
`;
const Title = styled.h3`
  margin: 12px 0;
  font-size: 18px;
  letter-spacing: 0.01em;
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
  font-size: 12px;
`;
const UserRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Username = styled.div`
  font-weight: bold;
  opacity: 0.7;
`;
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
const Ava = styled.img`
  width: 30px;
  height: 30px;
  background: #eee;
  border-radius: 20px;
  margin-right: 10px;
`;
const Earning = styled.div`
  display: flex;
  padding-top: 1px;
  font-size: 12px;
  opacity: 0.7;
  font-style: italic;
  padding-top: 1px;
`;
const Text = styled.div``;
const Head = styled.div`
  display: flex;
  font-size: 12px;
  opacity: 0.5;
`;
const Category = styled.div`
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-bottom: solid 1px #aaa;
`;
const Time = styled.div`
  margin-left: 4px;
  font-style: italic;
`;

class Card extends Component {
  votePost = data => {
    PostStore.votePost({
      author: data.author,
      permlink: data.permlink,
      weight: 10000
    });
  };
  unvotePost = data => {
    PostStore.votePost({
      author: data.author,
      permlink: data.permlink,
      weight: 0
    });
  };
  getCover(metadata) {
    if (metadata.image) {
      return metadata.image[0];
    }
    return "";
  }
  getDateString(date) {
    date = new Date(date);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const now = new Date();
    if (
      now.getDate() === day &&
      now.getMonth() === monthIndex &&
      now.getFullYear() === year
    ) {
      return "Today";
    }
    if (now.getFullYear() === year) {
      return day + " " + monthNames[monthIndex];
    }
    return day + " " + monthNames[monthIndex] + " " + year;
  }
  getDollars(sbd) {
    return parseFloat(sbd.split(" ")[0]).toFixed(2);
  }
  // getSubtitle(body) {
  //   console.log(removeMd(body));
  //   return "";
  // }
  render() {
    const { data } = this.props;
    return (
      <Wrapper>
        <LeftCard>
          <Head>
            <Link to={`/tag/${data.category}`}>
              <Category>{data.category || "science"}</Category>
            </Link>
            <Time>{this.getDateString(data.created) || "13 april"}</Time>
          </Head>
          <Link to={`/@${data.author}/${data.permlink}`}>
            <Title>{data.title || "How to train your dragon"}</Title>
            {/* <SubTitle>{this.getSubtitle(data.body)}</SubTitle> */}
          </Link>
          <User>
            <Link to={`/@${data.author}`}>
              <Ava
                src={`https://steemitimages.com/u/${data.author}/avatar/small`}
              />
            </Link>
            <UserRight>
              <Link to={`/@${data.author}`}>
                <Username>{data.author || "damaera"}</Username>
              </Link>
              <Earning>
                ${this.getDollars(data.pending_payout_value) || "240"}
                {!data.voteLoading ? (
                  data.isVoted ? (
                    <button onClick={() => this.unvotePost(data)}>
                      unvote
                    </button>
                  ) : (
                    <button onClick={() => this.votePost(data)}>vote</button>
                  )
                ) : (
                  <button>loading...</button>
                )}
              </Earning>
            </UserRight>
          </User>
        </LeftCard>
        {this.getCover(data.json_metadata) && (
          <RightCard>
            <Link to={`/@${data.author}/${data.permlink}`}>
              <Img
                src={
                  "https://steemitimages.com/160x200/" +
                  this.getCover(data.json_metadata)
                }
              />
            </Link>
          </RightCard>
        )}
      </Wrapper>
    );
  }
}

export default view(Card);
