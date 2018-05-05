import React, { Component } from "react";
import styled from "styled-components";

import { view } from "react-easy-state";
import { Link } from "react-router-dom";

import UserStore from "../../stores/User";
import PostStore from "../../stores/Post";

import sentenceCase from "sentence-case";

const Wrapper = styled.div`
  width: 400px;
  padding: 0 20px;
  @media only screen and (max-width: 770px) {
    display: none;
  }
`;
const Container = styled.div`
  background: #f6f6f6;
  border: solid 1px #eee;
  width: 100%;
  text-align: center;
`;
const Username = styled.h4`
  margin: 0 auto;
  font-family: "Josefin Slab", serif;
  padding: 10px;
  margin: 0;
  font-weight: bold;
  width: 100%;
  flex: 1;
`;
const Ava = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 40px;
  margin: 10px auto;
`;
const About = styled.div`
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.7;
`;
const Cover = styled.img`
  height: 240px;
  width: 100%;
  object-fit: cover;
`;
const Content = styled.div`
  padding: 20px;
  margin: 0 40px;
  position: relative;
  background: #fff;
  border: solid 1px #eee;
  top: -50px;
`;
const Item = styled.p`
  font-size: 15px;
  b {
    font-size: 14px;
  }
`;

class UserDetail extends Component {
  render() {
    const { username } = this.props;
    const user = UserStore.selectUser({ username });
    const loading = UserStore.selectLoading({ username });
    const profileMeta =
      user && user.json_metadata && user.json_metadata.profile
        ? user.json_metadata.profile
        : {};

    return (
      <Wrapper>
        <Container>
          <Cover
            src={
              profileMeta.cover_image
                ? `https://steemitimages.com/400x800/${
                    user.json_metadata.profile.cover_image
                  }`
                : ""
            }
          />
          <Content>
            <Ava
              src={
                profileMeta.profile_image
                  ? `https://steemitimages.com/120x240/${
                      user.json_metadata.profile.profile_image
                    }`
                  : ""
              }
            />
            <Username>
              {profileMeta.name ? user.json_metadata.profile.name : username}
            </Username>
            <About>
              {profileMeta.about ? user.json_metadata.profile.about : ""}
            </About>

            <hr />

            {Object.keys(profileMeta).map(key => {
              const value = profileMeta[key];
              if (
                value &&
                key !== "name" &&
                key !== "about" &&
                key !== "profile_image" &&
                key !== "cover_image"
              ) {
                return (
                  <Item key={key}>
                    <strong>{sentenceCase(key)} :</strong>
                    <br />
                    {value}
                  </Item>
                );
              }
            })}
          </Content>
        </Container>
      </Wrapper>
    );
  }
}

export default view(UserDetail);
