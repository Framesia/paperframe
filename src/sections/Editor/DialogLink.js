import React, { Component } from "react";

import Dialog from "rc-dialog";
import Button from "../../components/Button";
class DialogPublish extends Component {
  render() {
    return (
      <Dialog
        visible={this.props.linkDialogShow}
        animation="zoom"
        maskAnimation="fade"
        onClose={this.props.onClose}
        style={{ width: 400 }}
        mousePosition={this.props.mousePosition}
        destroyOnClose={true}
      >
        <h3>Enter link:</h3>
        <form onSubmit={this.props.onSubmitLink}>
          <input
            className="input"
            value={this.props.linkValue}
            placeholder="eg: https://framesia.com/"
            onChange={e => this.props.onChangeLink(e.target.value)}
          />
          <input type="submit" className="submit" />
        </form>
        <p
          className="error"
          dangerouslySetInnerHTML={{ __html: this.props.errorLink }}
        />
        <hr />
      </Dialog>
    );
  }
}

export default DialogPublish;
