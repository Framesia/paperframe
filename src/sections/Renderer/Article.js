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

const Header = styled.div`
  display: flex;
  border-bottom: solid 1px #ddd;
  padding: 8px 20px;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  max-width: 660px;
  top: 0;
  margin-left: -10px;
  z-index: 9;
  background: #fff;
`;
const User = styled.div`
  display: flex;
  align-items: center;
`;
const Ava = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 20px;
  object-fit: cover;
  margin-right: 10px;
`;
const Earning = styled.div`
  font-style: italic;
  font-size: 12px;
  opacity: 0.7;
`;
const SmallTitle = styled.h4`
  /* padding-left: 10px;
  border-left: solid 1px #ddd; */
  margin: 0;
  /* margin-left: 10px; */
  font-size: 12px;
  /* max-width: 300px; */
  max-height: 32px;
  overflow: hidden;
  /* @media only screen and (max-width: 640px) {
    & {
      display: none;
    }
  } */
`;
const Username = styled.div`
  font-size: 12px;
  opacity: 0.8;
  a {
    text-decoration: underline;
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
            <div>
              <SmallTitle>{post.title}</SmallTitle>
              <Username>
                <em>
                  ${parseFloat(post.pending_payout_value.split(" ")[0]).toFixed(
                    2
                  )}
                </em>
                {` — `}
                {`by `}
                <Link to={`/@${post.author}`}>{post.author}</Link>
              </Username>
            </div>
          </User>

          <Right>
            {!this.state.isShowTitleInHeader ? (
              <React.Fragment>
                <Time>{getDateString(post.created)}</Time>
                <Link to={`/tag/${post.category}`}>
                  <Category>{post.category}</Category>
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button>Vote</Button>
                <Button>Bookmark</Button>
              </React.Fragment>
            )}
          </Right>
        </Header>
        <div>
          <h1 className="title">{post.title}</h1>
          <div className="article">
            <div dangerouslySetInnerHTML={{ __html: renderToHTML(data) }} />
          </div>
        </div>
      </div>
    );
  }
}

export default view(Article);
