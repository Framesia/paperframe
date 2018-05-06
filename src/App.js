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

import PostStore from "./stores/Post";

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

              <meta name="twitter:card" content="summary" />
              <meta name="twitter:title" content="Framesia - Frame your thought and get rewards." />
              <meta
                name="twitter:description"
                content="Framesia is a platform where users are rewarded for sharing their voice. It is free to post, comment, & vote on content. You might even get paid for it!"
              />
              <meta
                name="twitter:image"
                content="https://framesia.com/framesia-logo.png"
              />

              <meta property="og:title" content="Framesia - Frame your thought and get rewards." />
              <meta property="og:type" content="article" />
              <meta property="og:url" content="https://framesia.com/" />
              <meta property="og:image" content="https://framesia.com/framesia-logo.png" />
              <meta property="og:description" content="Framesia is a platform where users are rewarded for sharing their voice. It is free to post, comment, & vote on content. You might even get paid for it!" />
              <meta property="og:site_name" content="Framesia" />
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
                path="/tag/:tag"
                render={props => (
                  <Redirect to={`/tag/${props.match.params.tag}/hot`} />
                )}
              />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
