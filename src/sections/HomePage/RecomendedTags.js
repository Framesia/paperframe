import React, { Component } from "react";
import styled from "styled-components";

import { view } from "react-easy-state";
import { Link } from "react-router-dom";

import AuthStore from "../../stores/Auth";
import PostStore from "../../stores/Post";

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
  padding: 0 20px;
  @media only screen and (max-width: 770px) {
    display: none;
  }
`;
const Container = styled.div`
  padding: 70px 0;
`;
const Content = styled.div`
  border: solid 1px #eee;
  border-top: none;
  padding: 20px;
  background: #fff;
`;

const CuratedTags = styled.div`
  /* border: solid 1px #ddd; */
`;
const Tags = styled.div`
  padding: 10px 0;
`;
const TagTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  margin-bottom: 10px;
`;
const Tag = styled.div`
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 5px 8px;
  background: #f6f6f6;
  border: solid 1px #eee;
  display: inline-block;
  font-size: 12px;
`;

class RecomendedTags extends Component {
  updateMetadata = me => {
    const metadata = me.account.json_metadata;
    metadata.follow_tags = ["science", "steemstem"];

    AuthStore.updateMetadata(metadata);
  };
  render() {
    const recommendedTags = {
      Knowledge: [
        "Science",
        "Technology",
        "Steemstem",
        "Astronomy",
        "Space",
        "History"
      ],
      Life: ["Parenting", "Travel", "Health", "Food", "Funny", "Life"],
      "Arts & Entertainment": [
        "Art",
        "Music",
        "Photography",
        "Entertainment",
        "Film"
      ],
      News: ["News", "Sports"],
      Finance: ["Cryptocurrency"]
    };
    // const recommendedTags = {};
    // const posts = PostStore.entities;
    // for (const key in posts) {
    //   if (posts.hasOwnProperty(key)) {
    //     const post = posts[key];
    //     const postTags = post.json_metadata.tags;
    //     postTags.forEach(tag => {
    //       if (!recommendedTags[tag]) {
    //         recommendedTags[tag] = 1;
    //       } else {
    //         recommendedTags[tag] += 1;
    //       }
    //     });
    //   }
    // }

    // console.log(
    //   Object.keys(recommendedTags).sort((a, b) => {
    //     return recommendedTags[b] - recommendedTags[a];
    //   })
    // );

    return (
      <Wrapper>
        <Container>
          <CuratedTags>
            <Title>Topics</Title>
            {/* {AuthStore.isLogin && (
              <button onClick={() => this.updateMetadata(AuthStore.me)}>
                update metadata
              </button>
            )} */}
            <Content>
              {Object.keys(recommendedTags).map((categoryTag, i) => {
                return (
                  <Tags key={i}>
                    <TagTitle>{categoryTag}</TagTitle>
                    <div>
                      {recommendedTags[categoryTag].map((tag, i) => (
                        <Link to={`/tag/${tag.toLowerCase()}`} key={i}>
                          <Tag>{tag}</Tag>
                        </Link>
                      ))}
                    </div>
                  </Tags>
                );
              })}
            </Content>
          </CuratedTags>
        </Container>
      </Wrapper>
    );
  }
}

export default view(RecomendedTags);
