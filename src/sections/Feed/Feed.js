import React, { Component } from "react";
import styled from "styled-components";

import sentenceCase from "sentence-case";

import { view } from "react-easy-state";
import { StickyContainer, Sticky } from "react-sticky";
import { Link } from "react-router-dom";

import PostStore from "../../stores/Post";
import AuthStore from "../../stores/Auth";
import TagStore from "../../stores/Tags";

import Card from "../../components/Card";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import FeedLoading from "./FeedLoading";

const Wrapper = styled.div`margin-bottom: 40px;`;
const Container = styled.div`
  width: 600px;
  margin: 0 auto;
  @media only screen and (max-width: 640px) {
    width: 100%;
  }
`;
const Content = styled.div`
  padding: 0 20px;
  border: solid 1px #eee;
  border-top: none;
  width: 100%;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  border: solid 1px #eee;
  background: #eae6ff;
  z-index: 5;
`;
const Heading = styled.h3`
  font-family: "Josefin Slab", serif;
  padding: 20px;
  margin: 0;
  font-weight: bold;
  /* flex: 1; */
`;
// const SortBy = styled.div``;
const LoadMoreWrapper = styled.div`
  padding: 10px 0;
  text-align: center;
`;
const FollowButton = styled(Button)`
  width: 100px;
  height: 35px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
`;
const SortBy = styled(Button)`
  width: 30px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  margin-right: 20px;
`;
const RightHeader = styled.div`
  display: flex;
  align-items: center;
`;
const DropItem = styled.div`
  padding: 6px 16px;
  font-size: 12px;
  color: #777;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #deebff;
    color: #333;
  }
`;
const DropdownWrapper = styled.div`
  position: relative;
  background: #fff;
  margin-left: -50px;
  border: solid 1px #eee;
  border-radius: 2px;

  a {
    text-decoration: none;
  }
`;

class Feed extends Component {
  state = {
    haveFetched: false,
    data: [],
    followText: "Followed ✓" // heading
  };

  componentDidMount() {
    if (!AuthStore.loading) {
      this.fetchPost({ tag: this.props.tag, sortBy: this.props.sortBy });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLogin === false && nextProps.isLogin) {
      this.fetchPost({ tag: nextProps.tag, sortBy: nextProps.sortBy });
    } else if (this.props.tag !== nextProps.tag) {
      this.fetchPost({ tag: nextProps.tag, sortBy: nextProps.sortBy });
    } else if (this.props.sortBy !== nextProps.sortBy) {
      this.fetchPost({ tag: nextProps.tag, sortBy: nextProps.sortBy });
    }
  }

  onClickFollow = () => {
    TagStore.followTag(this.props.tag);
  };
  onClickUnfollow = () => {
    TagStore.unfollowTag(this.props.tag);
  };

  fetchPost = ({ tag, sortBy = "hot", start_author, start_permlink }) => {
    let query = {
      tag,
      limit: 5,
      truncate_body: 1
    };
    if (start_author && start_permlink) {
      query.start_author = start_author;
      query.start_permlink = start_permlink;
      query.limit = 6;
    }
    PostStore.getPosts({
      sortBy,
      query
    });
  };

  render() {
    const sortBy = this.props.sortBy || "hot";
    const posts = PostStore.selectPosts({
      sortBy,
      tag: this.props.tag
    });
    const loading = PostStore.selectLoading({
      sortBy,
      tag: this.props.tag
    });

    let isFollowed = false;
    TagStore.selectFollowedTags().forEach(tag => {
      if (this.props.tag === tag) {
        isFollowed = true;
      }
    });

    const followLoading = TagStore.selectLoading(this.props.tag);

    return (
      <Wrapper>
        <Container>
          <StickyContainer>
            <Sticky>
              {({ style }) => {
                // console.log(style);
                return (
                  <Header style={{ ...style }}>
                    <Link to={`/tag/${this.props.tag}/${sortBy}`}>
                      <Heading>
                        {sentenceCase(this.props.tag)}
                        {this.props.sortBy && (
                          <Icon type={sortBy === "created" ? "new" : sortBy} />
                        )}
                      </Heading>
                    </Link>
                    <RightHeader>
                      {AuthStore.me.name &&
                        (!isFollowed ? (
                          <FollowButton
                            type="white"
                            onClick={this.onClickFollow}
                            disabled={followLoading}
                          >
                            {followLoading ? "Loading..." : "Follow"}
                          </FollowButton>
                        ) : (
                          <FollowButton
                            type="yellow"
                            onClick={this.onClickUnfollow}
                            disabled={followLoading}
                            onMouseEnter={e =>
                              this.setState({ followText: "Unfollow?" })}
                            onMouseLeave={e =>
                              this.setState({ followText: "Followed ✓" })}
                          >
                            {followLoading ? (
                              "Loading..."
                            ) : (
                              this.state.followText
                            )}
                          </FollowButton>
                        ))}
                      <Dropdown
                        placement="bottomRight"
                        dropdown={
                          <DropdownWrapper>
                            {["hot", "trending", "created"].map(item => (
                              <Link to={`/tag/${this.props.tag}/${item}`}>
                                <DropItem>{sentenceCase(item)}</DropItem>
                              </Link>
                            ))}
                          </DropdownWrapper>
                        }
                      >
                        <SortBy>▾</SortBy>
                      </Dropdown>
                    </RightHeader>
                  </Header>
                );
              }}
            </Sticky>
            <Content>
              {posts.map(item => {
                if (!item) {
                  return null;
                }
                return <Card data={item} key={item.id} />;
              })}
              {!loading && posts.length > 0 && posts.length % 5 === 0 ? (
                <LoadMoreWrapper>
                  <Button
                    type="blue"
                    onClick={() => {
                      this.fetchPost({
                        sortBy,
                        tag: this.props.tag,
                        start_author: posts[posts.length - 1].author,
                        start_permlink: posts[posts.length - 1].permlink
                      });
                    }}
                  >
                    Load more
                  </Button>
                </LoadMoreWrapper>
              ) : null}
              {loading && (
                <React.Fragment>
                  {[0].map(i => {
                    return <FeedLoading key={i} />;
                  })}
                </React.Fragment>
              )}
            </Content>
          </StickyContainer>
        </Container>
      </Wrapper>
    );
  }
}

export default view(Feed);
