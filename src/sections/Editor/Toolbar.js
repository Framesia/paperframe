import React from "react";
import styled from "styled-components";
import Icons from "./Icons";

import Dropdown from "../../components/Dropdown";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
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
    position: relative;
    display: flex;
    align-items: center;
    background: none;
    margin: 0;
    /* opacity: 0.3; */
    color: #333;
    padding: 5px;
    margin: 2px;
    border-radius: 20px;
    &:hover {
      /* background: #fff; */
      color: #999;
    }
    &.active {
      background: #79f2c0;
    }

    &.publish {
      background: #79f2c0;
      border-radius: 2px;
      padding: 5px 8px;
    }
  }
`;
const Group = styled.div`
  display: flex;
  align-items: center;
  /* margin-right: 10px; */
`;

const Toolbar = ({
  hasMark,
  hasBlock,
  hasFragment,
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
    <Tooltip placement="bottom" overlay={<span>{type}</span>}>
      <button
        className={hasMark(type) ? "active" : ""}
        onMouseDown={e => onClickMark(e, type)}
      >
        <Icons type={type} />
      </button>
    </Tooltip>
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
            <div className={block} style={{ width: 150 }}>
              {!isInTable && textBlock}
            </div>
          </div>
        </Dropdown>
      </Group>
      <Group>
        {Mark("bold")}
        {Mark("italic")}
        {Mark("code")}
        {Mark("sup")}
        {Mark("sub")}
        <Tooltip placement="bottom" overlay={<span>Insert link</span>}>
          <button
            className={
              value.inlines.some(inline => inline.type == "link")
                ? "active"
                : ""
            }
            onMouseDown={onClickLink}
          >
            <Icons type="link" />
          </button>
        </Tooltip>
      </Group>

      <Group>
        <Tooltip placement="bottom" overlay={<span>Insert image</span>}>
          <button onMouseDown={e => onInsertImage(e)}>
            <Icons type="image" />
          </button>
        </Tooltip>
        {!isInTable && (
          <React.Fragment>
            <Tooltip placement="bottom" overlay={<span>Pull left</span>}>
              <button
                className={hasFragment("pull-left") ? "active" : ""}
                onMouseDown={e => onClickBlock(e, "pull-left")}
              >
                <Icons type="pull-left" />
              </button>
            </Tooltip>
            <Tooltip placement="bottom" overlay={<span>Center</span>}>
              <button
                className={hasFragment("center") ? "active" : ""}
                onMouseDown={e => onClickBlock(e, "center")}
              >
                <Icons type="center" />
              </button>
            </Tooltip>
            <Tooltip placement="bottom" overlay={<span>Pull right</span>}>
              <button
                className={hasFragment("pull-right") ? "active" : ""}
                onMouseDown={e => onClickBlock(e, "pull-right")}
              >
                <Icons type="pull-right" />
              </button>
            </Tooltip>
            <Tooltip placement="bottom" overlay={<span>Insert table</span>}>
              <button onMouseDown={e => onInsertTable(e)}>
                <Icons type="table" />
              </button>
            </Tooltip>
          </React.Fragment>
        )}
      </Group>
      {isInTable && (
        <Group>
          <Tooltip placement="bottom" overlay={<span>Insert row</span>}>
            <button onMouseDown={e => onInsertRow(e)}>
              <Icons type="insert-row" />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" overlay={<span>Insert column</span>}>
            <button onMouseDown={e => onInsertColumn(e)}>
              <Icons type="insert-column" />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" overlay={<span>Remove row</span>}>
            <button onMouseDown={e => onRemoveRow(e)}>
              <Icons type="remove-row" />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" overlay={<span>Remove column</span>}>
            <button onMouseDown={e => onRemoveColumn(e)}>
              <Icons type="remove-column" />
            </button>
          </Tooltip>
          <Tooltip placement="bottom" overlay={<span>Delete table</span>}>
            <button onMouseDown={e => onRemoveTable(e)}>
              <Icons type="delete" />
            </button>
          </Tooltip>
        </Group>
      )}
      <Group>
        <button className="publish" onClick={e => onSerialize()}>
          Publish
        </button>
      </Group>
    </Wrapper>
  );
};

export default Toolbar;
