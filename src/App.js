import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import {}
import "rc-dropdown/assets/index.css";
import "rc-dialog/assets/index.css";
import "./App.css";

import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import ArticlePage from "./pages/ArticlePage";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/editor" component={EditorPage} />
            <Route path="/@:author/:permlink" component={ArticlePage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
