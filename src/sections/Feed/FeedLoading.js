import React from "react";
import ContentLoader from "react-content-loader";

import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px 0;
  border-bottom: solid 1px #eee;
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
      <rect x="0" y="0" rx="0" ry="0" width="100" height="15" />
      <rect x="0" y="27" rx="0" ry="0" width="260" height="21" />
      <rect x="0" y="55" rx="0" ry="0" width="300" height="21" />
      <circle cx="15" cy="105" r="15" />
      <rect x="35" y="95" rx="0" ry="0" width="72" height="9" />
      <rect x="35" y="109" rx="0" ry="0" width="39" height="6" />
    </ContentLoader>
  </Wrapper>
);

export default FeedLoader;
