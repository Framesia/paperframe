import React, { Component } from "react";
import styled from "styled-components";

import Header from "../sections/Header/Header";
import Editor from "../sections/Editor/Editor";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 660px;
  padding: 0 10px;
`;

class EditorPage extends Component {
  render() {
    return (
      <div>
        <Wrapper>
          <Editor />
        </Wrapper>
      </div>
    );
  }
}

export default EditorPage;
