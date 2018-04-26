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
    if (!post.id) {
      return <div>null</div>;
    }
    return (
      <div className="article">
        <div dangerouslySetInnerHTML={{ __html: renderToHTML(post) }} />
      </div>
    );
  }
}

export default view(Article);
