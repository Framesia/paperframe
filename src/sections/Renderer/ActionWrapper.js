import React, { Component } from "react";

import { view } from "react-easy-state";
import { Link } from "react-router-dom";

import styled from "styled-components";

import PostStore from "../../stores/Post";
import CommentStore from "../../stores/Comment";
import BookmarkStore from "../../stores/Bookmark";

import Icon from "../../components/Icon";

const Wrapper = styled.div`
  position: fixed;
  right: ${({ show }) => (show ? "calc(50% - 360px)" : "-120px")};
  transition: right 0.5s;

  top: 80px;
  z-index: 7;

  @media only screen and (max-width: 760px) {
    right: ${({ show }) => (show ? "20px" : "-120px")};
  }
`;
const ArticleFooter = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
`;
const ActionWrap = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;
const Count = styled.div`
  color: #999;
  cursor: pointer;
`;
const Action = styled.button`
  cursor: pointer;
  width: ${({ small }) => (small ? 32 : 40)}px;
  height: ${({ small }) => (small ? 32 : 40)}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #fff;
  border: solid 1px #eee;
  color: #999;
  font-size: ${({ small }) => (small ? 14 : 16)}px;
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
  votePost = (data, isComment) => {
    if (isComment) {
      CommentStore.votePost({
        author: data.author,
        permlink: data.permlink,
        weight: 10000
      });
    } else {
      PostStore.votePost({
        author: data.author,
        permlink: data.permlink,
        weight: 10000
      });
    }
  };
  unvotePost = (data, isComment) => {
    if (isComment) {
      CommentStore.votePost({
        author: data.author,
        permlink: data.permlink,
        weight: 0
      });
    } else {
      PostStore.votePost({
        author: data.author,
        permlink: data.permlink,
        weight: 0
      });
    }
  };
  bookmarkPost = data => {
    BookmarkStore.bookmark({ author: data.author, permlink: data.permlink });
  };
  unBookmarkPost = data => {
    BookmarkStore.unBookmark({ author: data.author, permlink: data.permlink });
  };
  render() {
    const { data, show, type } = this.props;
    if (type === "comment-footer") {
      return (
        <ArticleFooter>
          {data.isVoted ? (
            <React.Fragment>
              <Action
                className={`love-active ${data.voteLoading && "loading"}`}
                disabled={data.voteLoading}
                small
                onClick={() => this.unvotePost(data, true)}
              >
                <Icon type="love" />
              </Action>
              <Count
                disabled={data.voteLoading}
                onClick={() => this.unvotePost(data, true)}
              >
                {data.net_votes}
              </Count>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Action
                className={`${data.voteLoading && "loading"}`}
                disabled={data.voteLoading}
                small
                onClick={() => this.votePost(data, true)}
              >
                <Icon type="love-border" />
              </Action>
              <Count
                onClick={() => this.votePost(data, true)}
                disabled={data.voteLoading}
              >
                {data.net_votes}
              </Count>
            </React.Fragment>
          )}
        </ArticleFooter>
      );
    }
    if (type === "article-footer") {
      return (
        <ArticleFooter>
          <ActionWrap>
            {data.isVoted ? (
              <React.Fragment>
                <Action
                  className={`love-active ${data.voteLoading && "loading"}`}
                  disabled={data.voteLoading}
                  onClick={() => this.unvotePost(data)}
                >
                  <Icon type="love" />
                </Action>
                <Count
                  disabled={data.voteLoading}
                  onClick={() => this.unvotePost(data)}
                >
                  {data.net_votes}
                </Count>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Action
                  className={`${data.voteLoading && "loading"}`}
                  disabled={data.voteLoading}
                  onClick={() => this.votePost(data)}
                >
                  <Icon type="love-border" />
                </Action>
                <Count
                  onClick={() => this.votePost(data)}
                  disabled={data.voteLoading}
                >
                  {data.net_votes}
                </Count>
              </React.Fragment>
            )}
          </ActionWrap>
          <ActionWrap>
            <Action>
              <Icon type="comment-border" />
            </Action>
            <Count>{data.children}</Count>
          </ActionWrap>
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
        </ArticleFooter>
      );
    }
    return (
      <Wrapper show={show}>
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
