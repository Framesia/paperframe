import React from "react";
import styled from "styled-components";
import Icons from "./Icons";

import Dropdown from "../../components/Dropdown";

const Wrapper = styled.div`
  display: flex;
  height: 50px;
  padding: 10px;
  background: #ffebe5;
  /* color: #eee; */
  border: solid 1px #ffbdad;
  border-top: none;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  width: 640px;
  z-index: 5;

  button {
    display: flex;
    align-items: center;
    background: none;
    margin: 0;
    /* opacity: 0.3; */
    color: #344563;
    padding: 5px;
    margin: 2px;
    border-radius: 20px;
    &:hover {
      /* background: #fff; */
      opacity: 0.6;
    }
    &.active {
      background: #79f2c0;
      opacity: 1;
    }
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
  onRemoveRow,
  onRemoveColumn,
  onInsertRow,
  onInsertColumn,
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
    <div className={type} onMouseDown={e => onClickBlock(e, type)}>
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
  } else if (hasBlock("code-block") || hasBlock("code-line")) {
    block = "code-block";
    textBlock = "Code block";
  }

  const isInTable = tablePlugin.utils.isSelectionInTable(value);
  return (
    <Wrapper>
      <Group>
        <Dropdown
          dropdown={
            <div className="dropdown">
              {Node("paragraph", "Paragraph")}
              {Node("heading-one", "Big header")}
              {Node("heading-two", "Medium header")}
              {Node("heading-three", "Small header")}
              {Node("block-quote", "Quote")}
              {Node("code-block", "Code block")}
            </div>
          }
        >
          <div className="dropdown trigger">
            <div className={block} style={{ width: 160 }}>
              {!isInTable && textBlock}
            </div>
          </div>
        </Dropdown>
      </Group>
      <Group>
        {Mark("bold")}
        {Mark("italic")}
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

      <Group>
        <button onMouseDown={e => onInsertImage(e)}>
          <Icons type="image" />
        </button>
        {!isInTable && (
          <React.Fragment>
            <button onMouseDown={e => onClickBlock(e, "center")}>
              <Icons type="center" />
            </button>
            <button onMouseDown={e => onInsertTable(e)}>
              <Icons type="table" />
            </button>
          </React.Fragment>
        )}
      </Group>
      {isInTable && (
        <Group>
          <button onMouseDown={e => onInsertRow(e)}>
            <Icons type="insert-row" />
          </button>
          <button onMouseDown={e => onInsertColumn(e)}>
            <Icons type="insert-column" />
          </button>
          <button onMouseDown={e => onRemoveRow(e)}>
            <Icons type="remove-row" />
          </button>
          <button onMouseDown={e => onRemoveColumn(e)}>
            <Icons type="remove-column" />
          </button>
          <button onMouseDown={e => onRemoveTable(e)}>
            <Icons type="delete" />
          </button>
        </Group>
      )}
      <Group>
        <button>Publish</button>
      </Group>
    </Wrapper>
  );
};

export default Toolbar;
