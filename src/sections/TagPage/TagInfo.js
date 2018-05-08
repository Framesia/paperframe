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
  abbr {
    opacity: 0.7;
    text-transform: uppercase;
    font-size: 0.8em;
    letter-spacing: 0.1em;
  }
  p {
    margin-top: 10px;
    font-size: 0.9em;
  }

  .source {
    font-size: 0.8em;
    font-style: italic;
  }
`;
const Tag = styled.button`padding: 5px 10px;`;
const RelatedTagsTitle = styled.h4`font-size: 1em;`;

class TagInfo extends Component {
  componentDidMount() {
    TagStore.getDefinition(this.props.tag);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tag !== nextProps.tag) {
      TagStore.getDefinition(nextProps.tag);
    }
  }

  render() {
    const { tag } = this.props;
    const relatedTags = TagStore.selectRelatedTags(tag);
    const definition = TagStore.selectDefinition(tag) || {};

    return (
      <Wrapper>
        <Title>{definition.Heading || sentenceCase(tag)}</Title>
        <Content>
          {definition.Entity && <abbr>{definition.Entity}</abbr>}
          {definition.AbstractText && <p>{definition.AbstractText}</p>}
          {definition.AbstractSource && (
            <a className="source" href={definition.AbstractURL} target="_blank">
              Source: {definition.AbstractSource}
            </a>
          )}
          <hr />
          <RelatedTagsTitle>Related tags:</RelatedTagsTitle>
          {relatedTags.map(tag => {
            const tagName = Object.keys(tag)[0];
            const tagCount = Object.values(tag)[0];
            if (tagCount > 1) {
              return (
                <Link to={`/tag/${tagName}/hot`} key={tagName}>
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