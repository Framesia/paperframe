import React from "react";
import ContentLoader from "react-content-loader";

import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px 0;
  border-bottom: solid 1px #eee;
  width: 560px;
  @media only screen and (max-width: 640px) {
    width: 100%;
  }
`;

const FeedLoader = props => (
  <Wrapper>
    <ContentLoader
      height={120}
      width={560}
      speed={2}
      primaryColor="#eeeeee"
      secondaryColor="#f6f6f6"
      {...props}
    >
      <rect x="400" y="0" rx="0" ry="0" width="160" height="120" />
      <rect x="0" y="2.5" rx="0" ry="0" width="100" height="10" />
      <rect x="0" y="29.5" rx="0" ry="0" width="260" height="16" />
      <rect x="0" y="57.5" rx="0" ry="0" width="300" height="16" />
      <rect x="0" y="105" rx="0" ry="0" width="72" height="9" />
    </ContentLoader>
  </Wrapper>
);

export default FeedLoader;
