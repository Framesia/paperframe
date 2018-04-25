import React, { Component } from "react";

import styled from "styled-components";
import { view } from "react-easy-state";

import Header from "../sections/Header/Header";
import Landing from "../sections/HomePage/Landing";
import Feed from "../sections/HomePage/Feed";
import Sidebar from "../sections/HomePage/Sidebar";

import AuthStore from "../stores/Auth";

const WrapContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1000px;
  margin: 0 auto;
`;

class HomePage extends Component {
  componentDidMount() {
    console.log(AuthStore);
  }

  render() {
    return (
      <div>
        {AuthStore.isLogin !== true && <Landing />}
        <WrapContent>
          <Feed isLogin={AuthStore.isLogin} />
          <Sidebar />
        </WrapContent>
      </div>
    );
  }
}

export default view(HomePage);
