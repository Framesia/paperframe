import React, { Component } from "react";

import Remarkable from "remarkable";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { view } from "react-easy-state";

import PostStore from "../../stores/Post";

import steemApi from "../../helpers/steemApi";
import getDateString from "../../utils/getDateString";
import renderToHTML from "./renderToHTML";
import Loader from "../../components/Loader";

import ActionWrapper from "./ActionWrapper";

const Header = styled.div`
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 9;
  background: #fff;
`;
const User = styled.div`
  display: flex;
  align-items: center;
`;
const Ava = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  object-fit: cover;
  margin-right: 10px;
`;
const Earning = styled.div`
  font-style: italic;
  font-size: 14px;
  opacity: 0.7;
`;
const Username = styled.div`
  a {
    font-size: 14px;
    font-weight: bold;
    opacity: 0.9;
  }
`;
const Category = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: solid 1px #ddd;
`;
const Button = styled.button`
  margin: 3px;
  font-size: 12px;
  padding: 3px 8px;
  color: #333;
  border: solid 1px #ddd;
  background: #f6f6f6;
  font-weight: bold;
`;
const Time = styled.div`
  margin-right: 10px;
  font-size: 12px;
  font-style: italic;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
`;

class Article extends Component {
  state = {
    // value: ""
    isShowTitleInHeader: false
  };
  componentDidMount() {
    const { author, permlink } = this.props.params;
    PostStore.getContent({ author, permlink });

    window.addEventListener("scroll", e => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        if (!this.state.isShowTitleInHeader) {
          this.setState({ isShowTitleInHeader: true });
        }
      } else {
        if (this.state.isShowTitleInHeader) {
          this.setState({ isShowTitleInHeader: false });
        }
      }
    });
  }

  render() {
    const { author, permlink } = this.props.params;
    const id = `${author}/${permlink}`;
    const post = PostStore.selectPostById(id);
    const loading = PostStore.selectLoading({ author, permlink });

    if (!post.id || loading) {
      return <Loader />;
    }
    // immutable
    let { image, links, users } = post.json_metadata;
    const data = {
      body: post.body,
      json_metadata: {
        links: links ? [...links] : [],
        users: users ? [...users] : [],
        image: image ? [...image] : []
      }
    };
    return (
      <div>
        <Header>
          <User>
            <Link to={`/@${post.author}`}>
              <Ava
                src={`https://steemitimages.com/u/${post.author}/avatar/small`}
              />
            </Link>
            <Username>
              <Link to={`/@${post.author}`}>{post.author}</Link>
              <Earning>
                ${parseFloat(post.pending_payout_value.split(" ")[0]).toFixed(
                  2
                )}
              </Earning>
            </Username>
          </User>

          <Right>
            <Time>{getDateString(post.created)}</Time>
            <Link to={`/tag/${post.category}`}>
              <Category>{post.category}</Category>
            </Link>
          </Right>
        </Header>
        <div>
          <h1 className="title">{post.title}</h1>
          <div className="article">
            <div dangerouslySetInnerHTML={{ __html: renderToHTML(data) }} />
          </div>
          <ActionWrapper data={post} />
        </div>
      </div>
    );
  }
}

export default view(Article);
