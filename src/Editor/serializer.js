import React from "react";
import Html from "slate-html-serializer";

const BLOCK_TAGS = {
  p: "paragraph",
  pre: "code-block",
  h1: "heading-one",
  h2: "heading-two",
  h3: "heading-three",
  h4: "heading-four",
  h5: "heading-five",
  h6: "heading-six",
  blockquote: "block-quote",
  ol: "numbered-list",
  ul: "bulleted-list",
  li: "bulleted-item",
  figure: "figure",
  img: "image",
  figcaption: "figcaption",
  hr: "divider"
};
// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: "italic",
  strong: "bold",
  u: "underline",
  code: "code",
  abbr: "small-caps"
};

const INLINE_TAGS = {
  a: "link"
};

const deserializeNode = (el, next) => {
  const type = BLOCK_TAGS[el.tagName.toLowerCase()];
  if (type) {
    return {
      object: "block",
      type: type,
      nodes: next(el.childNodes)
    };
  }
};

const serializeNode = (obj, children) => {
  if (obj.object == "block") {
    switch (obj.type) {
      case "paragraph":
        return <p>{children}</p>;
      case "code-block":
        return (
          <pre>
            <code>{children}</code>
          </pre>
        );
      case "heading-one":
        return <h1>{children}</h1>;
      case "heading-two":
        return <h2>{children}</h2>;
      case "heading-three":
        return <h3>{children}</h3>;
      case "heading-four":
        return <h4>{children}</h4>;
      case "heading-five":
        return <h5>{children}</h5>;
      case "heading-six":
        return <h6>{children}</h6>;
      case "block-quote":
        return <blockquote>{children}</blockquote>;
      case "numbered-list":
        return <ol>{children}</ol>;
      case "bulleted-list":
        return <ul>{children}</ul>;
      case "bulleted-item":
        return <li>{children}</li>;
      case "numbered-item":
        return <li>{children}</li>;
      case "center":
        return <center>{children}</center>;
      case "image":
        return <img src={obj.data.get("src")} />;
      case "figure":
        return <figure>{children}</figure>;
      case "figcaption":
        return <figcaption>{children}</figcaption>;
      case "divider":
        return <hr />;
    }
  }
};

const deserializeMark = (el, next) => {
  const type = MARK_TAGS[el.tagName.toLowerCase()];
  if (type) {
    return {
      object: "mark",
      type: type,
      nodes: next(el.childNodes)
    };
  }
};

const serializeMark = (obj, children) => {
  if (obj.object == "mark") {
    switch (obj.type) {
      case "bold":
        return <strong>{children}</strong>;
      case "italic":
        return <em>{children}</em>;
      case "underline":
        return <u>{children}</u>;
      case "code":
        return <code>{children}</code>;
      case "strikethrough":
        return <del>{children}</del>;
      case "small-caps":
        return <abbr>{children}</abbr>;
    }
  }
};

const deserializeInline = (el, next) => {
  const type = INLINE_TAGS[el.tagName.toLowerCase()];
  if (type) {
    return {
      object: "inline",
      type: type,
      nodes: next(el.childNodes)
    };
  }
};
const serializeInline = (obj, children) => {
  if (obj.object == "inline") {
    switch (obj.type) {
      case "link":
        return <a href={obj.data.get("href")}>{children}</a>;
    }
  }
};

const rules = [
  // Rule that handles nodes...
  {
    deserialize: deserializeNode,
    serialize: serializeNode
  },
  // Rule that handles marks...
  {
    deserialize: deserializeMark,
    serialize: serializeMark
  },
  // Rule that handles inlines...
  {
    deserialize: deserializeInline,
    serialize: serializeInline
  }
];

const serializer = new Html({ rules });
export default serializer;
