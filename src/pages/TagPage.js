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
  componentWillMount() {
    const { tag, sortBy } = this.props.match.params;
    if (sortBy !== "new" || sortBy !== "created" || sortBy !== "hot") {
      this.props.history.push(`/tag/${tag}/hot`);
    }
  }

  render() {
    const { tag, sortBy } = this.props.match.params;
    return (
      <div>
        <Helmet>
          <title>{sentenceCase(tag)} topic - Framesia.</title>
        </Helmet>
        <WrapContent>
          <Content>
            <Feed isLogin={AuthStore.isLogin} tag={tag} sortBy={sortBy} />
          </Content>
        </WrapContent>
      </div>
    );
  }
}

export default view(TagPage);
