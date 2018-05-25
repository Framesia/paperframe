import React, { Component } from "react";
import { view } from "react-easy-state";
import CommentStore from "../../stores/Comment";

import styled from "styled-components";
import renderToHTML from "../Renderer/renderToHTML";
import { Link } from "react-router-dom";

import getDollars from "../../utils/getDollars";
import getDateString from "../../utils/getDateString";

import Loader from "../../components/Loader";

import ActionWrapper from "./ActionWrapper";

const CommentWrapper = styled.div`
  border: solid ${({ root }) => (root ? 1 : 0)}px #ddd;
  margin-bottom: ${({ root }) => (root ? 10 : 0)}px;
  margin-left: ${({ root }) => (root ? 0 : 15)}px;
  border-left: solid 1px #ddd;
  .article {
    padding: 0;
  }
`;
const Head = styled.div`
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Content = styled.div`
  padding: 0 15px;
  p {
    font-size: 18px;
  }
  blockquote p {
    font-size: 24px;
  }
  figure.is-wide {
    width: auto;
    max-width: auto;
    margin-left: 0;
  }
`;
const Ava = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  background: #eee;
  border-radius: 20px;
  margin-right: 10px;
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
const Earning = styled.div`
  display: flex;
  padding-top: 1px;
  font-size: 12px;
  opacity: 0.7;
  font-style: italic;
  padding-top: 1px;
`;
const Time = styled.div`
  margin-right: 10px;
  font-size: 12px;
  font-style: italic;
`;
class Comments extends Component {
  state = {
    commentsHasBeenLoaded: false
  };
  componentDidMount() {
    const { category, author, permlink, children } = this.props.post;
    if (children > 0) {
      // CommentStore.getComments({ category, author, permlink });
      window.addEventListener("scroll", this.scrollEvent);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollEvent);
  }

  scrollEvent = e => {
    const { category, author, permlink, children, body } = this.props.post;
    var d = document.documentElement;
    var offset = d.scrollTop + window.innerHeight;
    var height = d.offsetHeight;

    if (offset >= height - 100 && body.length > 2) {
      if (!this.state.commentsHasBeenLoaded) {
        const comments = CommentStore.selectComments({ author, permlink });
        if (!comments.length) {
          CommentStore.getComments({ category, author, permlink });
          this.setState({ commentsHasBeenLoaded: true });
        }
      }
    }
  };

  renderCommentLists = (comments, root) => {
    if (comments.length === 0) {
      return (
        <CommentWrapper root>
          <center>
            <div style={{ padding: 20 }}>
              There's no comment, be first to comment
            </div>
          </center>
        </CommentWrapper>
      );
    }
    return comments.map(comment => {
      if (!comment) {
        return null;
      }
      const { author, permlink } = comment;
      const hasSubcomment = comment.children > 0;
      let { image, links, users, tags } = comment.json_metadata;
      const data = {
        body: comment.body,
        json_metadata: {
          links: links ? [...links] : [],
          users: users ? [...users] : [],
          image: image ? [...image] : []
        },
        imageSizes: comment.imageSizes ? [...comment.imageSizes] : []
      };
      return (
        <CommentWrapper root={root} key={comment.id}>
          <Head>
            <User>
              <Link to={`/@${comment.author}`}>
                <Ava
                  src={`https://steemitimages.com/u/${comment.author}/avatar/small`}
                  onLoad={e => e.target.classList.add("loaded")}
                />
              </Link>
              <UserRight>
                <Link to={`/@${comment.author}`}>
                  <Username>{comment.author}</Username>
                </Link>
                <Earning>${getDollars(comment)}</Earning>
              </UserRight>
            </User>
            <Time>{getDateString(comment.created)}</Time>
          </Head>
          <Content>
            <div className="article">
              <div dangerouslySetInnerHTML={{ __html: renderToHTML(data) }} />
            </div>
            <ActionWrapper type="comment-footer" data={comment} />
          </Content>
          {hasSubcomment && (
            <div>
              {this.renderCommentLists(
                CommentStore.selectComments({ author, permlink }),
                false
              )}
            </div>
          )}
        </CommentWrapper>
      );
    });
  };

  render() {
    const { author, permlink } = this.props.post;

    const rootComments = CommentStore.selectComments({ author, permlink });
    const loading = CommentStore.selectLoading({ author, permlink });

    return (
      <div>
        {loading ? <Loader /> : this.renderCommentLists(rootComments, true)}
        <hr />
      </div>
    );
  }
}

export default view(Comments);
