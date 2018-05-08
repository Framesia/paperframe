import React, { Component } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { view } from "react-easy-state";
import TagStore from "../../stores/Tags";
import sentenceCase from "sentence-case";

const Title = styled.h3`
  font-family: "Josefin Slab", serif;
  flex: 1;
  margin: 0;
  font-weight: bold;
  padding: 20px;
  background: #ffebe5;
  border: solid 1px #eee;
`;
const Wrapper = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;
`;
const Container = styled.div`padding: 70px 0;`;
const Content = styled.div`
  border: solid 1px #eee;
  border-top: none;
  padding: 20px;
  background: #fff;
`;
const Tag = styled.button`padding: 5px 10px;`;

class TagInfo extends Component {
  render() {
    const { tag } = this.props;
    const relatedTags = TagStore.selectRelatedTags(tag);
    return (
      <Wrapper>
        <Title>Related tags</Title>
        <Content>
          {relatedTags.map(tag => {
            const tagName = Object.keys(tag)[0];
            const tagCount = Object.values(tag)[0];
            if (tagCount > 1) {
              return (
                <Link to={`/tag/${tagName}/hot`}>
                  <Tag>{sentenceCase(tagName)}</Tag>
                </Link>
              );
            } else {
              return null;
            }
          })}
        </Content>
      </Wrapper>
    );
  }
}

export default view(TagInfo);
