import { findDOMNode } from "slate-react";

const normalize = stateValue => {
  const onBackspace = (event, change) => {
    // const { value } = change;
    // const { document } = stateValue;
    // if (value.isExpanded) return;
    // if (value.startOffset != 0) return;
    // const { startBlock } = value;
    // console.log(startBlock.type);
    // if (startBlock.type == "list-item") {
    //   return;
    // }
    // // console.log(document.getParent(startBlock.key))
    // event.preventDefault();
    // change.setBlocks("paragraph");
    // return true;
  };

  const onDelete = (event, change) => {
    const { value } = change;
    // console.log(value.startBlock.get("type"));
    return;
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
    if (
      startBlock.type !== "heading-one" &&
      startBlock.type !== "heading-two" &&
      startBlock.type !== "heading-three" &&
      startBlock.type !== "heading-four" &&
      startBlock.type !== "heading-five" &&
      startBlock.type !== "heading-six" &&
      startBlock.type !== "block-quote"
      // startBlock.type !== "numbered-list" &&
      // startBlock.type !== "bulleted-list"
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
        // case "Backspace":
        //   return onBackspace(event, change);
        // case "Delete":
        //   return onDelete(event, change);
        case "Enter":
          return onEnter(event, change);
      }
    }
  };
};

export default normalize;
