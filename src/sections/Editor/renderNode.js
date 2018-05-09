import React from "react";

const renderNode = props => {
  const firstChar = props.node.text[0];
  let HangingDouble = null;
  let HangingSingle = null;
  if (firstChar === "“" || firstChar === '"') {
    HangingDouble = <span className="hanging-double" />;
  }
  if (firstChar === "'" || firstChar === "‘") {
    HangingSingle = <span className="hanging-single" />;
  }
  switch (props.node.type) {
    case "code-block":
      return (
        <pre {...props.attributes}>
          <code>{props.children}</code>
        </pre>
      );
    case "code-line":
      return (
        <div className="code-line" {...props.attributes}>
          {props.children}
        </div>
      );
    case "pull-left":
      return (
        <div className="pull-left" {...props.attributes}>
          {props.children}
        </div>
      );
    case "pull-right":
      return (
        <div className="pull-right" {...props.attributes}>
          {props.children}
        </div>
      );
    case "paragraph":
      // let readOnly = true;
      // if (readOnly) {
      //   if (/^\s+$/.test(props.node.text)) {
      //     return null;
      //   }
      // }
      return (
        <p {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </p>
      );
    case "bulleted-list":
      return <ul {...props.attributes}>{props.children}</ul>;
    case "numbered-list":
      return <ol {...props.attributes}>{props.children}</ol>;
    case "list-item":
      return <li {...props.attributes}>{props.children}</li>;
    // case "numbered-item":
    //   return (
    //     <li {...props.attributes}>
    //       {props.children}
    //     </li>
    //   );
    case "heading-one":
      return (
        <h1 {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </h6>
      );
    case "block-quote":
      return (
        <blockquote {...props.attributes}>
          {HangingDouble}
          {HangingSingle}
          {props.children}
        </blockquote>
      );
    case "link": {
      const { data } = props.node;
      const href = data.get("href");
      return (
        <a {...props.attributes} href={href}>
          {props.children}
        </a>
      );
    }
    case "image": {
      const { data } = props.node;
      const src = data.get("src");
      return (
        <img
          alt=""
          {...props.attributes}
          style={{ cursor: "pointer" }}
          src={`https://steemitimages.com/0x0/${src}`}
        />
      );
    }
    // case "figure": {
    //   const firstChildType = props.node
    //     .get("nodes")
    //     .get("0")
    //     .get("type");
    //   if (firstChildType !== "image") {
    //     return null;
    //   }
    //   return <figure {...props.attributes}>{props.children}</figure>;
    // }
    // case "figcaption": {
    //   return <figcaption {...props.attributes}>{props.children}</figcaption>;
    // }
    case "divider":
      return <hr />;
    case "center":
      return <center {...props.attributes}>{props.children}</center>;
    case "table":
      return (
        <table {...props.attributes}>
          <tbody {...props.attributes}>{props.children}</tbody>
        </table>
      );
    case "table-row":
      return <tr {...props.attributes}>{props.children}</tr>;
    case "table-cell":
      return <td {...props.attributes}>{props.children}</td>;
    default:
      return "";
  }
};

export default renderNode;
