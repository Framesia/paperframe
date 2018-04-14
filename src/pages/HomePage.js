import React, { Component } from "react";

import Header from "../sections/Header/Header";
import Landing from "../sections/HomePage/Landing";
import Feed from "../sections/HomePage/Feed";

class HomePage extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <Landing />
          <Feed />
        </div>
      </div>
    );
  }
}

export default HomePage;
