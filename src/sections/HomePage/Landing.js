import React, { Component } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import Button from "../../components/Button";

import IllustSrc from "./illust.png";

const Wrapper = styled.div`
  background: #333;
  color: #eee;
  padding: 50px 20px;
  width: 100%;
  @media only screen and (max-width: 1000px) {
    padding: 20px;
  }
`;
const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  position: relative;

  @media only screen and (max-width: 1000px) {
    flex-direction: column-reverse;
    max-width: 640px;
    width: 100%;
  }
  /* div {
    width: 0px;
  } */
`;
const Title = styled.h1`
  margin: 0;

  font-size: 42px;
  font-family: "Josefin Slab", serif;
  font-weight: normal;
`;
const Illust = styled.img`
  width: 360px;
  height: 360px;
  position: absolute;
  right: 0;
  top: -20px;
  opacity: 0;
  object-fit: cover;
  transition: opacity 0.8s;
  &.loaded {
    opacity: 1;
  }
  @media only screen and (max-width: 1000px) {
    position: relative;
    top: 0;
    right: 0;
    margin-bottom: 20px;
    width: 100%;
    height: 240px;
  }
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
  /* border: solid 1px rgba(0, 0, 0, 0.1); */
`;

class Landing extends Component {
  render() {
    return (
      <Wrapper>
        <Container>
          <div>
            <Title>
              Frame your thought<br /> and get rewards.
            </Title>
            <p>
              <b>Framesia</b> is a platform where users are rewarded for sharing
              their voice.
              <br />
              It is free to post, comment, <i>&</i> vote on content.
              <br />
              <i>You might even get paid for it!</i>
            </p>
            <Button type="red">Getting started</Button>
            <Link to="/try-editor">
              <Button type="green">Try out the editor!</Button>
            </Link>
          </div>
          <Illust
            src={IllustSrc}
            onLoad={e => e.target.classList.add("loaded")}
          />
        </Container>
      </Wrapper>
    );
  }
}

export default Landing;
