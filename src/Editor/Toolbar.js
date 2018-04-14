import React from "react";
import styled from "styled-components";
import Icons from "./Icons";

import Dropdown from "rc-dropdown";

const Wrapper = styled.div`
  display: flex;
  height: 50px;
  padding: 10px;
  background: #fff;
  color: #eee;
  border: solid 1px #eee;
  border-top: none;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  max-width: 600px;
  button {
    display: flex;
    align-items: center;
    background: none;
    margin: 0;
    opacity: 0.3;
    padding: 6px;
    margin: 2px;
    border-radius: 20px;
    &.active {
      background: #f6f6f6;
      opacity: 1;
    }
    &:hover {
      background: #eee;
    }
  }

  .dropdown-items {
  }
`;
const Group = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const Toolbar = ({
  hasMark,
  hasBlock,
  onClickBlock,
  onClickLink,
  onClickMark,
  onInsertImage,
  onInsertTable,
  value,
  onSerialize,
  onRemoveTable,
  tablePlugin
}) => {
  const Mark = type => (
    <button
      className={hasMark(type) ? "active" : ""}
      onMouseDown={e => onClickMark(e, type)}
    >
      <Icons type={type} />
    </button>
  );

  const Node = (type, text) => (
    <div className={type} onMouseDown={e => onClickBlock(e, { type })}>
      {text}
    </div>
  );
  let textBlock = "Paragraph";
  let block = "paragraph";
  if (hasBlock("heading-one")) {
    block = "heading-one";
    textBlock = "Big header";
  } else if (hasBlock("heading-two")) {
    block = "heading-two";
    textBlock = "Medium header";
  } else if (
    hasBlock("heading-three") ||
    hasBlock("heading-four") ||
    hasBlock("heading-five") ||
    hasBlock("heading-six")
  ) {
    block = "heading-three";
    textBlock = "Small header";
  } else if (hasBlock("block-quote")) {
    block = "block-quote";
    textBlock = "Quote";
  } else if (hasBlock("code-block")) {
    block = "code-block";
    textBlock = "Code block";
  }

  const isInTable = tablePlugin.utils.isSelectionInTable(value);
  return (
    <Wrapper>
      <Group>
        <Dropdown
          trigger={["click"]}
          overlay={
            <div className="dropdown">
              {Node("paragraph", "Paragraph")}
              {Node("heading-one", "Big header")}
              {Node("heading-two", "Medium header")}
              {Node("heading-three", "Small header")}
              {Node("block-quote", "Quote")}
              {Node("code-block", "Code block")}
            </div>
          }
          overlayClassName="dropdown-items"
          animation="slide-up"
        >
          <div className="dropdown trigger">
            <div className={block} style={{ width: 160 }}>
              {textBlock}
            </div>
          </div>
        </Dropdown>
      </Group>
      <Group>
        {Mark("bold")}
        {Mark("italic")}
        {Mark("underline")}
      </Group>
      <Group>
        {Mark("code")}
        <button
          className={
            value.inlines.some(inline => inline.type == "link") ? "active" : ""
          }
          onMouseDown={onClickLink}
        >
          <Icons type="link" />
        </button>
      </Group>
      <button onMouseDown={onSerialize}>serialize</button>
      {!isInTable && (
        <React.Fragment>
          <button onMouseDown={e => onClickBlock(e, "center")}>center</button>
          <button onMouseDown={e => onInsertImage(e)}>image</button>
          <button onMouseDown={e => onInsertTable(e)}>table</button>
        </React.Fragment>
      )}
      {isInTable && (
        <button onMouseDown={e => onRemoveTable(e)}>delete table</button>
      )}
    </Wrapper>
  );
};

export default Toolbar;
