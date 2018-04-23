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
  componentDidMount() {
    // console.log(this.props.mar);
  }
  render() {
    return (
      <div>
        <Wrapper>
          <Article params={this.props.match.params} />
        </Wrapper>
      </div>
    );
  }
}

export default EditorPage;
