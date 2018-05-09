import React, { Component } from "react";

import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

import Dialog from "rc-dialog";
import Button from "../../components/Button";

class DialogPublish extends Component {
  componentDidMount() {}
  onSubmit(e) {
    e.preventDefault();
  }
  render() {
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
          <input />
          <Button>Publish</Button>
        </form>
        <hr />
      </Dialog>
    );
  }
}

export default DialogPublish;
