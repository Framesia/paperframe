import React from 'react'
import Html from "slate-html-serializer";

const BLOCK_TAGS = {
  p: "paragraph",
  pre: "codeBlock"
};
// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: "italic",
  strong: "bold",
  u: "underline",
  code: "code"
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
}

const serializeNode = (obj, children) => {
  if (obj.object == "block") {
    switch (obj.type) {
      case "code":
        return (
          <pre>
            <code>{children}</code>
          </pre>
        );
      case "paragraph":
        return <p>{children}</p>;
    }
  }
}

const deserializeMark = (el, next) => {
  const type = MARK_TAGS[el.tagName.toLowerCase()];
  if (type) {
    return {
      object: "mark",
      type: type,
      nodes: next(el.childNodes)
    };
  }
}

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
    }
  }
}


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
  }
];

const serializer = new Html({ rules });
export default serializer