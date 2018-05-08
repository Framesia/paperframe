import React, { Component } from "react";
import styled from "styled-components";
import { view } from "react-easy-state";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

import BookmarkStore from "../stores/Bookmark";
import AuthStore from "../stores/Auth";
import PostStore from "../stores/Post";

import Icon from "../components/Icon";
import sentenceCase from "sentence-case";
const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 660px;
  padding: 0 10px;
`;

const Bookmark = styled.div`
  padding: 20px;
  border: solid 1px #ddd;
  margin-bottom: 20px;
  display: flex;

  .action-wrapper {
    button {
      opacity: 0.6;
    }
  }
  :hover {
    background: #f6f6f6;
    .action-wrapper {
      button {
        opacity: 1;
      }
    }
  }
  /* align-items: center; */
`;

const Title = styled.h2`font-family: "Josefin Slab", serif;`;

const Ava = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  background: #eee;
  border-radius: 20px;
  margin-right: 20px;
`;

const Username = styled.div`
  font-weight: bold;
  opacity: 0.7;
`;
const Content = styled.div`flex: 1;`;

const ActionWrapper = styled.div`
  display: flex;
  &.hide {
    display: none;
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
  margin: 0;
  &:hover {
    background: #eee;
  }
  &.bookmark-active {
    color: #57d9a3;
    opacity: 1 !important;
  }
  &.loading {
    opacity: 0.4 !important;
  }
`;

class BookmarksPage extends Component {
  unBookmarkPost = ({ author, permlink }) => {
    BookmarkStore.unBookmark({ author, permlink });
  };
  render() {
    const loading = AuthStore.loading;
    if (loading) {
      return (
        <Wrapper>
          <Loader />
        </Wrapper>
      );
    }
    const bookmarks = BookmarkStore.selectBookmarks();

    return (
      <Wrapper>
        <Title>Bookmarked post</Title>
        {bookmarks.length === 0 && (
          <Bookmark>
            <Content>
              <Username>No bookmark</Username>
              <p>You have not bookmark any post.</p>
            </Content>
          </Bookmark>
        )}
        {bookmarks.map(bookmark => {
          const data = PostStore.selectPostById(bookmark);
          const [author, permlink] = bookmark.split("/");
          if (!bookmark) {
            return null;
          }
          return (
            <Link to={`/@${author}/${permlink}`}>
              <Bookmark>
                <Ava
                  src={`https://steemitimages.com/u/${author}/avatar/small`}
                  onLoad={e => e.target.classList.add("loaded")}
                />
                <Content>
                  <Username>{author}</Username>
                  <p>{sentenceCase(permlink)}</p>
                </Content>
                <ActionWrapper
                  className={`action-wrapper ${AuthStore.me.user
                    ? "show"
                    : "hide"}`}
                >
                  <Action
                    className={`bookmark-active ${data.bookmarkLoading &&
                      "loading"}`}
                    disabled={data.bookmarkLoading}
                    onClick={e => {
                      e.preventDefault();
                      this.unBookmarkPost({ author, permlink });
                    }}
                  >
                    <Icon type="bookmark" />
                  </Action>
                </ActionWrapper>
              </Bookmark>
            </Link>
          );
        })}
      </Wrapper>
    );
  }
}
export default view(BookmarksPage);
