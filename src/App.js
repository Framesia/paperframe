import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import {}
import "rc-dropdown/assets/index.css";
import "rc-dialog/assets/index.css";
import "./App.css";

import Header from "./sections/Header/Header";

import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import ArticlePage from "./pages/ArticlePage";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/editor" component={EditorPage} />
              <Route path="/@:author/:permlink" component={ArticlePage} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
