import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
// import {}
import "rc-dropdown/assets/index.css";
import "rc-dialog/assets/index.css";
import "./App.css";

import Header from "./sections/Header/Header";

import HomePage from "./pages/HomePage";
import TryEditorPage from "./pages/TryEditorPage";
import WritePage from "./pages/WritePage";

import ArticlePage from "./pages/ArticlePage";
import TagPage from "./pages/TagPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostStore from "./stores/Post";
class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Helmet>
              <title>Framesia - Frame your thought and get rewards.</title>
              <meta
                name="description"
                content="Framesia is a platform where users are rewarded for sharing their voice. It is free to post, comment, & vote on content. You might even get paid for it!"
              />

              {/* <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@publisher_handle" />
          <meta name="twitter:title" content="Page Title" />
          <meta
            name="twitter:description"
            content="Page description less than 200 characters"
          />
          <meta name="twitter:creator" content="@author_handle" />
          <meta
            name="twitter:image"
            content="http://www.example.com/image.jpg"
          />

          <meta property="og:title" content="Title Here" />
          <meta property="og:type" content="article" />
          <meta property="og:url" content="http://www.example.com/" />
          <meta property="og:image" content="http://example.com/image.jpg" />
          <meta property="og:description" content="Description Here" />
          <meta property="og:site_name" content="Site Name, i.e. Moz" />
          <meta property="fb:admins" content="Facebook numeric ID" /> */}
            </Helmet>
            <Header />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/try-editor" component={TryEditorPage} />
              <Route path="/write" component={WritePage} />
              <Route path="/@:author/:permlink" component={ArticlePage} />
              <Route path="/tag/:tag" component={TagPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
