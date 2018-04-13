import React, { Component } from "react";
import { Client } from "dsteem";

import Remarkable from "remarkable";
const client = new Client("https://api.steemit.com");

class Renderer extends Component {
  state = {
    value: ""
  };
  componentDidMount() {
    const md = new Remarkable({
      html: true,
      breaks: false,
      linkify: true, // linkify is done locally
      typographer: true, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
      quotes: "“”‘’"
    });
    client.database
      .getDiscussions("trending", { tag: "steemstem", limit: 1 })
      .then(data => {
        let value = md.render(data[0].body);
        console.log(value);
        this.setState({ value });
      });
  }

  render() {
    return (
      <div className="editor">
        <div dangerouslySetInnerHTML={{ __html: this.state.value }} />
      </div>
    );
  }
}

export default Renderer;
