import { findDOMNode } from "slate-react";

const normalize = stateValue => {
  const onBackspace = (event, change) => {
    const { value } = change;
    const { document } = stateValue;
    if (value.isExpanded) return;
    if (value.startOffset != 0) return;

    const { startBlock } = value;

    // console.log(document.getParent(startBlock.key))
    const nodeName = findDOMNode(
      startBlock
    ).parentNode.parentNode.nodeName.toLowerCase();
    if (startBlock.type === "paragraph") {
      // if (nodeName === "div") {
      change.unwrapBlock("figure");
      // }
      return;
    }

    event.preventDefault();
    change.setBlocks("paragraph");

    if (startBlock.type === "bulleted-item") {
      change.unwrapBlock("bulleted-list");
    } else if (startBlock.type === "numbered-item") {
      change.unwrapBlock("numbered-list");
    } else if (startBlock.type === "figcaption") {
      change.unwrapBlock("figure");
    }
    if (nodeName === "ul") {
      change.setBlocks("bulleted-item");
    }
    if (nodeName === "ol") {
      change.setBlocks("numbered-item");
    }

    return true;
  };

  const onEnter = (event, change) => {
    const { value } = change;
    if (value.isExpanded) return;

    const { startBlock, startOffset, endOffset } = value;
    if (startOffset === 0 && startBlock.text.length === 0)
      return onBackspace(event, change);
    // if (endOffset != startBlock.text.length) return;
    if (startBlock.type === "code-block") {
      if (!event.shiftKey) {
        event.preventDefault();
        change.splitBlock().setBlocks("paragraph");
        return true;
      } else {
        return;
      }
    }
    if (startBlock.type === "figcaption") {
      change
        .splitBlock()
        .setBlocks("paragraph")
        .unwrapBlock("figure");
      return true;
    }
    if (
      startBlock.type !== "heading-one" &&
      startBlock.type !== "heading-two" &&
      startBlock.type !== "heading-three" &&
      startBlock.type !== "heading-four" &&
      startBlock.type !== "heading-five" &&
      startBlock.type !== "heading-six" &&
      startBlock.type !== "block-quote" &&
      startBlock.type !== "numbered-list" &&
      startBlock.type !== "bulleted-list"
    ) {
      return;
    }

    event.preventDefault();
    change.splitBlock().setBlocks("paragraph");
    return true;
  };

  return {
    onKeyDown(event, change) {
      switch (event.key) {
        case "Backspace":
          return onBackspace(event, change);
        case "Enter":
          return onEnter(event, change);
      }
    }
  };
};

export default normalize;
