import React, { Component } from "react";
import styled from "styled-components";

import { view } from "react-easy-state";
import { Helmet } from "react-helmet";
import AuthStore from "../stores/Auth";

import Feed from "../sections/Feed/Feed";

import sentenceCase from "sentence-case";

const WrapContent = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
`;
const Content = styled.div``;

class TagPage extends Component {
  render() {
    const { tag } = this.props.match.params;
    return (
      <div>
        <Helmet>
          <title>{sentenceCase(tag)} topics - Framesia.</title>
        </Helmet>
        <WrapContent>
          <Content>
            <Feed isLogin={AuthStore.isLogin} tag={tag} />
          </Content>
        </WrapContent>
      </div>
    );
  }
}

export default view(TagPage);
