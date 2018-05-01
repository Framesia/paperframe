import React, { Component } from "react";

import { view } from "react-easy-state";
import { Link } from "react-router-dom";

import styled from "styled-components";

import PostStore from "../../stores/Post";
import BookmarkStore from "../../stores/Bookmark";

import Icon from "../../components/Icon";

const Wrapper = styled.div`
  position: fixed;
  right: calc(50% - 360px);
  top: 100px;
  z-index: 7;

  @media only screen and (max-width: 760px) {
    right: 20px;
  }
`;
const Action = styled.button`
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #fff;
  border: solid 1px #eee;
  color: #999;
  font-size: 16px;
  margin: 5px;
  &:hover {
    background: #eee;
  }
  &.love-active {
    color: #ff7452;
    border-color: #fff;
    opacity: 1 !important;
  }
  &.bookmark-active {
    color: #57d9a3;
    border-color: #fff;
    opacity: 1 !important;
  }
  &.loading {
    opacity: 0.4 !important;
  }
`;

class ActionWrapper extends Component {
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
  render() {
    const { data } = this.props;
    return (
      <Wrapper>
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
            className={`bookmark-active ${data.bookmarkLoading && "loading"}`}
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
      </Wrapper>
    );
  }
}

export default view(ActionWrapper);
