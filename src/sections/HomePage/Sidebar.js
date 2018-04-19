import React, { Component } from "react";
import styled from "styled-components";

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
  render() {
    return (
      <Wrapper>
        <Container>
          <Title>Trending tags</Title>
        </Container>
      </Wrapper>
    );
  }
}

export default Sidebar;
