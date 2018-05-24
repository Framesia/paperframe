import React, { Component } from "react";

const Icons = ({ size = 24, color = "#999999", type }) => {
  let Path = null;
  switch (type) {
    case "bookmark-border":
      Path = (
        <React.Fragment>
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </React.Fragment>
      );
      break;
    case "bookmark":
      Path = (
        <React.Fragment>
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </React.Fragment>
      );
      break;
    case "love-border":
      Path = (
        <React.Fragment>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
        </React.Fragment>
      );
      break;
    case "love":
      Path = (
        <React.Fragment>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </React.Fragment>
      );
      break;
    case "new":
      Path = (
        <React.Fragment>
          <defs>
            <path d="M0 0h24v24H0V0z" id="a" />
          </defs>
          <clipPath id="b">
            <use overflow="visible" xlinkHref="#a" />
          </clipPath>
          <path
            clipPath="url(#b)"
            d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-3.5V15H3.5V9h1.25l2.5 3.5V9H8.5v6zm5-4.74H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4v1.26zm7 3.74c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25v5z"
          />
        </React.Fragment>
      );
      break;
    case "hot":
      Path = (
        <React.Fragment>
          <path d="M11.71,19C9.93,19 8.5,17.59 8.5,15.86C8.5,14.24 9.53,13.1 11.3,12.74C13.07,12.38 14.9,11.53 15.92,10.16C16.31,11.45 16.5,12.81 16.5,14.2C16.5,16.84 14.36,19 11.71,19M13.5,0.67C13.5,0.67 14.24,3.32 14.24,5.47C14.24,7.53 12.89,9.2 10.83,9.2C8.76,9.2 7.2,7.53 7.2,5.47L7.23,5.1C5.21,7.5 4,10.61 4,14A8,8 0 0,0 12,22A8,8 0 0,0 20,14C20,8.6 17.41,3.8 13.5,0.67Z" />
        </React.Fragment>
      );
      break;
    case "trending":
      Path = (
        <React.Fragment>
          <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
        </React.Fragment>
      );
      break;
    case "comment-border":
      Path = (
        <React.Fragment>
          <path d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
        </React.Fragment>
      );
      break;
    case "comment":
      Path = (
        <React.Fragment>
          <path d="M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M9,9V11H19V9H9M9,13V15H17V13H9Z" />
        </React.Fragment>
      );
      break;
    default:
      break;
  }
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {Path}
    </svg>
  );
};

export default Icons;
