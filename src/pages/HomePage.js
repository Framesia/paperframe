import React, { Component } from "react";

import styled from "styled-components";

import Header from "../sections/Header/Header";
import Landing from "../sections/HomePage/Landing";
import Feed from "../sections/HomePage/Feed";
import Sidebar from "../sections/HomePage/Sidebar";

const WrapContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1000px;
  margin: 0 auto;
`;

class HomePage extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <Landing />
          <WrapContent>
            <Feed />
            <Sidebar />
          </WrapContent>
        </div>
      </div>
    );
  }
}

export default HomePage;
