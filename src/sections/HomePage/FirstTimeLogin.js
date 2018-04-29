import React, { Component } from "react";
import styled from "styled-components";

import Loader from "../../components/Loader";
import RecomendedTags from "./RecomendedTags";
const Wrapper = styled.div`
  padding: 50px 20px;
  max-width: 600px;
`;
class FirstTimeLogin extends Component {
  render() {
    return (
      <Wrapper>
        <center>
          <blockquote>
            Look like, you don't have following any topics
          </blockquote>
          <p>Go, follow some topics...</p>
          <hr />
        </center>
      </Wrapper>
    );
  }
}

export default FirstTimeLogin;
