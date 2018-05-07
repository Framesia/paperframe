import React, { Component } from "react";

import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 20px;
  margin: 30px auto;
  max-width: 660px;
  width: 100%;
`

class NotFoundPage extends Component {
  render() {
    return (
      <Wrapper className='article'>
        <a href='https://en.wikipedia.org/wiki/HTTP_404' target='_blank'>
          <h1>HTTP 404</h1>
        </a>
        <p>
          <sup>From <a href='https://en.wikipedia.org/wiki/HTTP_404' target='_blank'>Wikipedia</a>, the free encyclopedia</sup>
        </p>
        <p>
          The <abbr>HTTP</abbr> 404, 404 Not Found and 404 (pronounced "four oh four") error message is a Hypertext Transfer Protocol (<abbr>HTTP</abbr>) standard response code, in computer network communications, to indicate that the client was able to communicate with a given server, but the server could not find what was requested.
        </p>
        <p>
          The website hosting server will typically generate a "404 Not Found" web page when a user attempts to follow a broken or dead link; hence the 404 error is one of the most recognizable errors encountered on the World Wide Web.
        </p>
        <hr />
      </Wrapper>
    )
  }
}

export default NotFoundPage;
