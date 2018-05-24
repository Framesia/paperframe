import React, { Component } from "react";
import { view } from "react-easy-state";
import CommentStore from "../../stores/Comment";
class Comments extends Component {
  componentDidMount() {
    const { category, author, permlink, children } = this.props.post;
    if (children > 0) {
      // CommentStore.getComments({ category, author, permlink });
    }
  }

  render() {
    const { author, permlink } = this.props.post;
    // const comments = CommentStore.selectComments({ author, permlink });
    // const rootComments = comments.filter(
    //   comment =>
    //     comment.root_author === author && comment.root_permlink === permlink
    // );
    // return <div>{Object.keys(comments).map(c => <div>{c}</div>)}</div>;
    return null;
  }
}

export default view(Comments);
