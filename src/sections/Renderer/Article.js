import React, { Component } from "react";

import Remarkable from "remarkable";
import steemApi from "../../helpers/steemApi";

import PostStore from "../../stores/Post";
import { view } from "react-easy-state";
import renderToHTML from "./renderToHTML";
class Article extends Component {
  // state = {
  //   value: ""
  // };
  componentDidMount() {
    const { author, permlink } = this.props.params;
    PostStore.getContent({ author, permlink });
  }

  render() {
    const { author, permlink } = this.props.params;
    const id = `${author}/${permlink}`;
    const post = PostStore.selectPostById(id);
    const loading = PostStore.selectLoading({ author, permlink });

    if (!post.id || loading) {
      return <div>Loading...</div>;
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
      <div className="article">
        <div dangerouslySetInnerHTML={{ __html: renderToHTML(data) }} />
      </div>
    );
  }
}

export default view(Article);
