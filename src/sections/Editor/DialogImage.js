import React, { Component } from "react";
import Dialog from "rc-dialog";
import Button from "../../components/Button";
class DialogImage extends Component {
  state = {
    imageValue: ""
  };
  render() {
    return (
      <Dialog
        visible={this.props.imageDialogShow}
        animation="zoom"
        maskAnimation="fade"
        onClose={this.props.onClose}
        style={{ width: 740 }}
        mousePosition={this.props.mousePosition}
        destroyOnClose={true}
      >
        <h3>Enter img:</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.props.onSubmitImage(this.state.imageValue);
            this.setState({ imageValue: "" });
          }}
        >
          <input
            className="input"
            value={this.state.imageValue}
            onChange={e => this.setState({ imageValue: e.target.value })}
          />
          <input type="submit" style={{ visibility: "hidden" }} />
          <Button>Submit</Button>
        </form>
        {/*<div>
            {this.state.imgUnsplash.map(item => (
              <img
                style={{ margin: 10 }}
                src={item.urls.thumb}
                onClick={() => this.onSubmitImage(item.urls.small)}
              />
            ))}
          </div>*/}
        <hr />
      </Dialog>
    );
  }
}

export default DialogImage;
