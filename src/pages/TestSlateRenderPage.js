import React, { Component } from "react";
import Renderer from "../sections/Editor/Renderer";
import root from "window-or-global";

class TestSlateRenderPage extends Component {
  render() {
    const value = root.localStorage.getItem("article-draft-body");
    const data = {
      body: value,
      json_metadata: { links: [], users: [], image: [] },
      imageSizes: []
    };
    return (
      <div style={{ maxWidth: 640, margin: "20px auto" }}>
        <Renderer value={value} />
      </div>
    );
  }
}

export default TestSlateRenderPage;
