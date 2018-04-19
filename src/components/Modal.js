import React, { Component } from "react";

class Modal extends Component {
  render() {
    return (
      <Dialog
        visible={this.state.linkDialongShow}
        animation="zoom"
        maskAnimation="fade"
        onClose={() =>
          this.setState({
            linkDialongShow: false
          })
        }
        style={{ width: 400 }}
        mousePosition={this.state.mousePosition}
        destroyOnClose={true}
      >
        <h3>Enter link:</h3>
        <form onSubmit={this.onSubmitLink}>
          <input
            className="input"
            value={this.state.linkValue}
            placeholder="eg: https://framesia.com/"
            onChange={e => this.setState({ linkValue: e.target.value })}
          />
          <input type="submit" className="submit" />
        </form>
        <p
          className="error"
          dangerouslySetInnerHTML={{ __html: this.state.errorLink }}
        />
        <hr />
      </Dialog>
    );
  }
}

export default Modal;
