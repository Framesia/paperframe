import React, { Component } from "react";
import styled from "styled-components";

import Header from "../sections/Header/Header";
import Article from "../sections/Renderer/Article";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 660px;
  padding: 0 10px;
`;

class EditorPage extends Component {
  render() {
    return (
      <div>
        <Header />
        <Wrapper>
          <Article />
        </Wrapper>
      </div>
    );
  }
}

export default EditorPage;
