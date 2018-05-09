import React, { Component } from "react";

import renderToHTML from "../sections/Renderer/renderToHTML";

class TestRenderPage extends Component {
  render() {
    const data = {
      body: window.localStorage.getItem("article-draft-body"),
      json_metadata: {
        links: [],
        users: [],
        image: []
      },
      imageSizes: []
    };
    return (
      <div
        style={{
          maxWidth: 640,
          margin: "20px auto"
        }}
      >
        <div className="article">
          <div dangerouslySetInnerHTML={{ __html: renderToHTML(data) }} />
        </div>
      </div>
    );
  }
}

export default TestRenderPage;
