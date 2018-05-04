import React, { Component } from "react";
import styled from "styled-components";

import { view } from "react-easy-state";

import { Link } from "react-router-dom";

import PostStore from "../stores/Post";
import BookmarkStore from "../stores/Bookmark";

import getDateString from "../utils/getDateString";

import Icon from "./Icon";

const Wrapper = styled.div`
  padding: 12px 0;
  border-bottom: solid 1px #eee;
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
  .action-wrapper {
    button {
      opacity: 0.6;
    }
  }
  :hover {
    .action-wrapper {
      button {
        opacity: 1;
      }
    }
  }

  img {
    opacity: 0;
    transition: opacity 0.8s;
  }
  img.loaded {
    opacity: 1;
  }
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

  @media only screen and (max-width: 480px) {
    width: 120px;
  }
  @media only screen and (max-width: 360px) {
    width: 90px;
  }
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
  background: #f6f6f6;
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
  flex: 1;
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
const ActionWrapper = styled.div`
  display: flex;
`;
const Action = styled.button`
  cursor: pointer;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #fff;
  color: #999;
  font-size: 16px;
  margin: 0;
  &:hover {
    background: #eee;
  }
  &.love-active {
    color: #ff7452;
    opacity: 1 !important;
  }
  &.bookmark-active {
    color: #57d9a3;
    opacity: 1 !important;
  }
  &.loading {
    opacity: 0.4 !important;
  }
`;

class Card extends Component {
  state = {
    voteText: "Voted"
  };
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
  bookmarkPost = data => {
    BookmarkStore.bookmark({ author: data.author, permlink: data.permlink });
  };
  unBookmarkPost = data => {
    BookmarkStore.unBookmark({ author: data.author, permlink: data.permlink });
  };
  getCover(metadata) {
    if (metadata.image) {
      return metadata.image[0];
    }
    return "";
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
              <Category>{data.category}</Category>
            </Link>
            <Time>{getDateString(data.created)}</Time>
          </Head>
          <Link to={`/@${data.author}/${data.permlink}`}>
            <Title>{data.title}</Title>
          </Link>
          <User>
            <Link to={`/@${data.author}`}>
              <Ava
                src={`https://steemitimages.com/u/${data.author}/avatar/small`}
                onLoad={e => e.target.classList.add("loaded")}
              />
            </Link>
            <UserRight>
              <Link to={`/@${data.author}`}>
                <Username>{data.author}</Username>
              </Link>
              <Earning>
                ${this.getDollars(data.pending_payout_value) || "240"}
              </Earning>
            </UserRight>
            <ActionWrapper className="action-wrapper">
              {data.isVoted ? (
                <Action
                  className={`love-active ${data.voteLoading && "loading"}`}
                  disabled={data.voteLoading}
                  onClick={() => this.unvotePost(data)}
                >
                  <Icon type="love" />
                </Action>
              ) : (
                <Action
                  className={`${data.voteLoading && "loading"}`}
                  disabled={data.voteLoading}
                  onClick={() => this.votePost(data)}
                >
                  <Icon type="love-border" />
                </Action>
              )}
              {data.isBookmarked ? (
                <Action
                  className={`bookmark-active ${data.bookmarkLoading &&
                    "loading"}`}
                  disabled={data.bookmarkLoading}
                  onClick={() => this.unBookmarkPost(data)}
                >
                  <Icon type="bookmark" />
                </Action>
              ) : (
                <Action
                  className={`${data.bookmarkLoading && "loading"}`}
                  disabled={data.bookmarkLoading}
                  onClick={() => this.bookmarkPost(data)}
                >
                  <Icon type="bookmark-border" />
                </Action>
              )}
            </ActionWrapper>
          </User>
        </LeftCard>
        {this.getCover(data.json_metadata) ? (
          <RightCard>
            <Link to={`/@${data.author}/${data.permlink}`}>
              <Img
                src={
                  "https://steemitimages.com/160x200/" +
                  this.getCover(data.json_metadata)
                }
                onLoad={e => e.target.classList.add("loaded")}
              />
            </Link>
          </RightCard>
        ) : (
          <RightCard />
        )}
      </Wrapper>
    );
  }
}

export default view(Card);
