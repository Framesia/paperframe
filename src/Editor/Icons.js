import React, { Component } from "react";

const Icons = ({ size = 24, color = "#444444", type }) => {
  let Path = (
    <React.Fragment>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
    </React.Fragment>
  );
  switch (type) {
    case "italic":
      Path = (
        <React.Fragment>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
        </React.Fragment>
      );
      break;
    case "bold":
      Path = (
        <React.Fragment>
          <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </React.Fragment>
      );
      break;
    case "code":
      Path = (
        <React.Fragment>
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
        </React.Fragment>
      );
      break;
    case "underline":
      Path = (
        <React.Fragment>
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
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
