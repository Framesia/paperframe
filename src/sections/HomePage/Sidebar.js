import React, { Component } from "react";
import styled from "styled-components";

import { view } from "react-easy-state";
import AuthStore from "../../stores/Auth";

const Title = styled.h3`
  font-family: "Josefin Slab", serif;
  flex: 1;
  margin: 20px 0;
  font-weight: normal;
`;
const Wrapper = styled.div`
  width: 400px;

  padding: 0 20px;
`;
const Container = styled.div`
  padding-top: 70px;
  background: #f6f6f6;
  height: 100%;
`;

class Sidebar extends Component {
  updateMetadata = me => {
    const metadata = me.account.json_metadata;
    metadata.follow_tags = ["science", "steemstem"];

    AuthStore.updateMetadata(metadata);
  };
  render() {
    console.log(AuthStore.me);
    return (
      <Wrapper>
        <Container>
          <Title>Trending tags</Title>
          {AuthStore.isLogin && (
            <button onClick={() => this.updateMetadata(AuthStore.me)}>
              update metadata
            </button>
          )}
        </Container>
      </Wrapper>
    );
  }
}

export default view(Sidebar);
