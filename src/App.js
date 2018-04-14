import React, { Component } from "react";

import "rc-dropdown/assets/index.css";
import "rc-dialog/assets/index.css";
import "./App.css";

import Editor from "./Editor/";
import Renderer from "./Renderer/";
import Header from "./Header/Header";
class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="wrapper">
          <Editor />
          {/* <Renderer /> */}
        </div>
      </div>
    );
  }
}

export default App;
