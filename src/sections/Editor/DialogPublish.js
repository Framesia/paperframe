import React, { Component } from "react";

import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import Dialog from "rc-dialog";
import Button from "../../components/Button";

class DialogPublish extends Component {
  state = {
    tags: []
  };
  componentDidMount() {}
  onSubmit(e) {
    e.preventDefault();
    const title = window.localStorage.getItem("article-draft-title");
    const body = window.localStorage.getItem("article-draft-body");
    console.log(title, body);
  }
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
