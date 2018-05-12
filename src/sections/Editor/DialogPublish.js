import React, { Component } from "react";

import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import arslugify from "arslugify";

import Dialog from "rc-dialog";
import Button from "../../components/Button";

class DialogPublish extends Component {
  state = {
    tags: []
  };
  componentDidMount() {}
  onSubmit = e => {
    e.preventDefault();
    const title = window.localStorage.getItem("article-draft-title");
    const body = window.localStorage.getItem("article-draft-body");
    const permlink = arslugify(title);
    const tags = this.state.tags.map(tag => {
      return arslugify(tag);
    });
    console.log(title, body, permlink, tags);
  };
  render() {
    const tags = this.state.tags.filter((val, i, self) => {
      return self.indexOf(val) === i;
    });
    return (
      <Dialog
        visible={this.props.publishDialogShow}
        animation="zoom"
        maskAnimation="fade"
        onClose={this.props.onClose}
        style={{ width: 400 }}
        mousePosition={this.props.mousePosition}
        destroyOnClose={true}
      >
        <h3>Publish article</h3>
        <form onSubmit={this.onSubmit}>
          <TagsInput
            value={tags}
            onChange={tags => {
              if (tags.length <= 5) {
                this.setState({ tags });
              }
            }}
          />
          <Button>Publish</Button>
        </form>
        <hr />
      </Dialog>
    );
  }
}

export default DialogPublish;
