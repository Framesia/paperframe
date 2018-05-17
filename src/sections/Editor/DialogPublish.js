import React, { Component } from "react";

import { view } from "react-easy-state";

import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import arslugify from "arslugify";
import sentenceCase from "sentence-case";

import Dialog from "rc-dialog";
import Button from "../../components/Button";

import root from "window-or-global";

import PostStore from "../../stores/Post";
class DialogPublish extends Component {
  state = {
    tags: JSON.parse(root.localStorage.getItem("article-draft-tags")) || []
  };
  componentDidMount() {
    PostStore.create.data = {};
    PostStore.create.loading = false;
    PostStore.create.success = false;
    PostStore.create.error = false;
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.publishDialogShow && nextProps.publishDialogShow) {
      PostStore.create.loading = false;
      PostStore.create.success = false;
      PostStore.create.error = false;
      PostStore.create.data = {};
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const title = root.localStorage.getItem("article-draft-title");
    const body = root.localStorage.getItem("article-draft-body");

    const tags = this.state.tags;
    PostStore.createPost({ title, body, tags });
  };
  onClose = () => {
    if (!PostStore.create.loading) {
      this.props.onClose();
    }
  };
  render() {
    const tags = this.state.tags.filter((val, i, self) => {
      return self.indexOf(val) === i;
    });
    const loading = PostStore.create.loading;
    const data = PostStore.create.data;
    const error = PostStore.create.error;
    const success = PostStore.create.success;
    return (
      <Dialog
        visible={this.props.publishDialogShow}
        animation="zoom"
        maskAnimation="fade"
        onClose={this.onClose}
        style={{ width: 400 }}
        mousePosition={this.props.mousePosition}
        destroyOnClose={true}
      >
        <h3>Publish article</h3>
        {error &&
          !loading && (
            <div>
              <p>Error</p>
            </div>
          )}
        {success &&
          !loading && (
            <div>
              <p>Success</p>
            </div>
          )}
        {!loading &&
          !error &&
          !success && (
            <form onSubmit={this.onSubmit}>
              <TagsInput
                value={tags}
                onChange={tags => {
                  if (tags.length <= 5) {
                    tags = tags.map(tag => sentenceCase(tag));
                    root.localStorage.setItem(
                      "article-draft-tags",
                      JSON.stringify(tags)
                    );
                    this.setState({ tags });
                  }
                }}
              />
              <Button>Publish</Button>
            </form>
          )}
        {loading && !error && !success && <p>Loading...</p>}
        <hr />
      </Dialog>
    );
  }
}

export default view(DialogPublish);
