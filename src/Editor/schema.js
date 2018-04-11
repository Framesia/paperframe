import isUrl from "is-url";
import { normalize } from "upath";

const schema = {
  document: {
    nodes: [
      {
        types: [
          "paragraph",
          "figure",
          "image",
          "figcaption",
          "heading-one",
          "heading-two",
          "heading-three",
          "heading-four",
          "heading-five",
          "heading-six",
          "block-quote",
          "code-block",
          "center",
          "divider",
          "table",
          "numbered-list",
          "numbered-item",
          "bulleted-list",
          "bulleted-item",
          "link",
          "div"
        ]
      }
    ]
    // normalize: () => (change, reason, context) => {
    //   console.log(reason);
    // }
  },
  inlines: {
    link: {
      data: {
        href: v => v && isUrl(v)
      },
      nodes: [{ objects: ["text"] }]
    }
  },
  blocks: {
    // link: {},
    div: {},
    paragraph: {
      // isVoid: false
      // nodes: [{ objects: ["text"] }]
    },
    figcaption: {
      // nodes: [{ objects: ["text"] }],
      // parent: { types: ["figure"] }
    },
    "heading-one": {
      // nodes: [{ objects: ["text"] }]
    },
    "heading-two": {
      // nodes: [{ objects: ["text"] }]
    },
    "heading-three": {
      // nodes: [{ objects: ["text"] }]
    },
    "heading-four": {
      // nodes: [{ objects: ["text"] }]
    },
    "heading-five": {
      // nodes: [{ objects: ["text"] }]
    },
    "heading-six": {
      // nodes: [{ objects: ["text"] }]
    },
    "block-quote": {
      // nodes: [{ objects: ["text"] }]
    },
    "code-block": {
      // nodes: [{ objects: ["text"] }]
    },
    figure: {
      // nodes: [{ types: ["image", "figcaption"] }]
    },
    center: {
      // nodes: [
      //   {
      //     types: [
      //       "paragraph",
      //       "heading-one",
      //       "heading-two",
      //       "heading-three",
      //       "heading-four",
      //       "heading-five",
      //       "heading-six",
      //       "block-quote"
      //     ]
      //   }
      // ]
    },
    image: {
      // isVoid: true,
      // data: {
      //   src: v => v && isUrl(v)
      // }
    },
    divider: { isVoid: true },
    table: {
      nodes: [{ types: ["table-row"] }]
    },
    "table-row": {
      nodes: [{ types: ["table-cell"] }]
    },
    "table-cell": {
      nodes: [{ types: ["paragraph"] }]
    },
    "numbered-list": {
      // nodes: [{ types: ["numbered-item"] }]
    },
    "numbered-item": {
      // nodes: [{ objects: ["text"] }]
    },
    "bulleted-list": {
      // nodes: [{ types: ["bulleted-item"] }]
    },
    "bulleted-item": {
      // nodes: [{ objects: ["text"] }]
    }
  }
};

export default schema;
