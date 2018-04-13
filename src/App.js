import React, { Component } from "react";
import logo from "./logo.svg";

import "rc-dropdown/assets/index.css";
import "rc-dialog/assets/index.css";
import "./App.css";

import Editor from "./Editor/";
import Renderer from "./Renderer/";

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        {/* <Editor /> */}
        <Renderer />
      </div>
    );
  }
}

export default App;
