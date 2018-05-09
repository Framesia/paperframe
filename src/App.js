import React, { Component } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  withRouter,
  Redirect
} from "react-router-dom";
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
import UserPage from "./pages/UserPage";
import NotFoundPage from "./pages/NotFoundPage";

// import PostStore from "./stores/Post";
import BookmarksPage from "./pages/BookmarksPage";
import TestRenderPage from "./pages/TestRenderPage";

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}
const ScrollTop = withRouter(ScrollToTop);

class App extends Component {
  componentDidUpdate() {
    console.log(window.location);
  }
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
            </Helmet>
            <ScrollTop />
            <Header />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/try-editor" component={TryEditorPage} />
              <Route path="/write" component={WritePage} />

              <Route path="/@:author/:permlink" component={ArticlePage} />
              <Route path="/@:username/" component={UserPage} />

              <Route path="/tag/:tag/:sortBy" component={TagPage} />
              <Route
                exact
                path="/tag/:tag"
                render={props => (
                  <Redirect to={`/tag/${props.match.params.tag}/hot`} />
                )}
              />

              <Route path="/me/bookmarks" component={BookmarksPage} />
              <Route path="/test-render" component={TestRenderPage} />

              {/*<Route path="/me/topics" component={TagPage} />
              <Route path="/me/bookmarks" component={TagPage} />*/}
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
