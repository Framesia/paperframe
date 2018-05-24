import React, { Component } from "react";
import CommentStore from "../../stores/Comment";
class Comments extends Component {
  componentDidMount() {
    const { category, author, permlink } = this.props.post;
    // CommentStore.getComments({ category, author, permlink });
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    return <div />;
  }
}

export default Comments;
