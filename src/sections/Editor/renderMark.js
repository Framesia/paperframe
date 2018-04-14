import React from "react";
const renderMark = props => {
  switch (props.mark.type) {
    case "bold":
      return <strong>{props.children}</strong>;
    case "italic":
      return <em>{props.children}</em>;
    case "code":
      return <code>{props.children}</code>;
    case "strikethrough":
      return <del>{props.children}</del>;
    case "underline":
      return <u>{props.children}</u>;
    case "sub":
      return <sub>{props.children}</sub>;
    case "sup":
      return <sup>{props.children}</sup>;
    // case "small-caps":
    //   return <abbr>{props.children}</abbr>;
  }
};

export default renderMark;
