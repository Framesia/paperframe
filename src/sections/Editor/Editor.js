// Import React!
import React from "react";
import { Value } from "slate";
import { Editor } from "slate-react";

import { Client } from "dsteem";

import TextareaAutosize from "react-textarea-autosize";

import Dropdown from "rc-dropdown";
import Dialog from "rc-dialog";

import isUrl from "is-url";

import serializer from "./serializer";
import initialValue from "./initialValue.json";

import Icons from "./Icons";
import schema from "./schema";

import SoftBreak from "slate-soft-break";
import PluginEditTable from "slate-edit-table";
import PluginEditList from "slate-edit-list";
import PluginEditCode from "slate-edit-code";

import normalize from "./plugins/normalize";
import hotKey from "./plugins/hotKey";
import markdownShortcut from "./plugins/markdownShortcut";

import renderNode from "./renderNode";
import renderMark from "./renderMark";

import Toolbar from "./Toolbar";

const tablePlugin = PluginEditTable({
  typeRow: "table-row",
  typeCell: "table-cell",
  exitBlockType: "enter"
});

const listPlugin = PluginEditList({
  types: ["bulleted-list", "numbered-list"],
  typeItem: "list-item"
});
const codePlugin = PluginEditCode({
  containerType: "code-block",
  lineType: "code-line"
});

export default class EditorApp extends React.Component {
  state = {
    value: serializer.deserialize(""),
    linkDialongShow: false,
    mousePosition: { x: 0, y: 0 },
    linkValue: "",
    title: "",
    errorLink: "",
    figureClicked: -1
  };

  componentDidMount() {}

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

  plugins = [
    codePlugin,
    tablePlugin,
    listPlugin,
    ...hotKey,
    ...markdownShortcut({ hasMark: this.hasMark, listPlugin, codePlugin }),
    SoftBreak({ shift: true }),
    normalize(this.state.value)
  ];

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type == type);
  };
  onChange = ({ value }) => {
    this.setState({ value });
  };

  onClickMark = (e, type) => {
    e.preventDefault();
    const { value } = this.state;
    const change = value.change().toggleMark(type);
    this.onChange(change);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    let change = value.change();
    const { document } = value;

    const isCenterActive = value.fragment.nodes.some(
      node => node.type == "center"
    );
    if (type == "center") {
      if (isCenterActive) {
        change.unwrapBlock("center");
      } else {
        change.wrapBlock("center");
      }
    } else if (type == "code-block") {
      change = codePlugin.changes.toggleCodeBlock(change);
    } else {
      if (this.hasBlock("code-line")) {
        change = codePlugin.changes.toggleCodeBlock(change);
      }
      const isActive = this.hasBlock(type);
      change.setBlocks(isActive ? "paragraph" : type);
      // }
    }
    // else if (type != "bulleted-list" && type != "numbered-list") {
    //   // Handle everything but list buttons. and center
    //   const isActive = this.hasBlock(type);
    //   const isList = this.hasBlock("list-item");

    //   if (isList) {
    //     // change
    //     //   .setBlocks(isActive ? "paragraph" : type)
    //     //   .unwrapBlock("bulleted-list")
    //     //   .unwrapBlock("numbered-list");
    //   } else {
    //     change.setBlocks(isActive ? "paragraph" : type);
    //   }
    // } else {
    //   // Handle the extra wrapping required for list buttons.
    //   const isList = this.hasBlock("list-item");
    //   const isType = value.blocks.some(block => {
    //     return !!document.getClosest(block.key, parent => parent.type == type);
    //   });

    //   if (isList && isType) {
    //     change
    //       .setBlocks("paragraph")
    //       .unwrapBlock("bulleted-list")
    //       .unwrapBlock("numbered-list");
    //   } else if (isList) {
    //     change
    //       .unwrapBlock(
    //         type == "bulleted-list" ? "numbered-list" : "bulleted-list"
    //       )
    //       .wrapBlock(type);
    //   } else {
    //     change.setBlocks("list-item").wrapBlock(type);
    //   }
    // }

    this.onChange(change);
  };

  onSerialize = () => {
    // const { nodes } = this.state.value.toJSON().document
    console.log(serializer.serialize(this.state.value));
  };

  onInsertImage = e => {
    e.preventDefault();
    const { value } = this.state;
    const change = value.change();
    change.insertInline({
      type: "image",
      isVoid: true,
      data: {
        src:
          "https://cdn-enterprise.discourse.org/imgur/uploads/default/original/3X/9/4/946841767587979b888acd2c2e6f6a99982ff68a.jpg"
      }
    });
    this.onChange(change);
  };

  onInsertTable = e => {
    e.preventDefault();
    const change = tablePlugin.changes.insertTable(this.state.value.change());
    this.onChange(change);
  };
  onInsertRow = e => {
    e.preventDefault();
    const change = tablePlugin.changes.insertRow(this.state.value.change());
    this.onChange(change);
  };
  onInsertColumn = e => {
    e.preventDefault();
    const change = tablePlugin.changes.insertColumn(this.state.value.change());
    this.onChange(change);
  };
  onRemoveTable = e => {
    e.preventDefault();
    const change = tablePlugin.changes.removeTable(this.state.value.change());
    this.onChange(change);
  };
  onRemoveRow = e => {
    e.preventDefault();
    const change = tablePlugin.changes.removeRow(this.state.value.change());
    this.onChange(change);
  };
  onRemoveColumn = e => {
    e.preventDefault();
    const change = tablePlugin.changes.removeColumn(this.state.value.change());
    this.onChange(change);
  };

  onClickLink = e => {
    e.preventDefault();
    const { value } = this.state;
    const hasLinks = value.inlines.some(inline => inline.type == "link");
    const change = value.change();

    if (hasLinks) {
      change.unwrapInline("link");
    } else if (value.isExpanded) {
      this.setState({
        mousePosition: {
          x: e.pageX,
          y: e.pageY
        },
        linkDialongShow: true
      });
    }

    this.onChange(change);
  };

  onSubmitLink = e => {
    e.preventDefault();
    const change = this.state.value.change();
    const href = this.state.linkValue;
    if (isUrl(href)) {
      change
        .wrapInline({
          type: "link",
          data: { href }
        })
        .focus()
        .collapseToEnd();
      // .blur();
      this.setState({
        linkValue: "",
        linkDialongShow: false,
        errorLink: ""
      });
      this.onChange(change);
    } else {
      this.setState({
        errorLink: "<em>The <abbr>URL</abbr> is not valid.</em>"
      });
    }
  };

  render() {
    // console.log(this.state);
    return (
      <div>
        <Toolbar
          value={this.state.value}
          hasMark={this.hasMark}
          hasBlock={this.hasBlock}
          onClickBlock={this.onClickBlock}
          onClickLink={this.onClickLink}
          onClickMark={this.onClickMark}
          onInsertImage={this.onInsertImage}
          //
          onInsertTable={this.onInsertTable}
          onInsertRow={this.onInsertRow}
          onInsertColumn={this.onInsertColumn}
          onRemoveTable={this.onRemoveTable}
          onRemoveRow={this.onRemoveRow}
          onRemoveColumn={this.onRemoveColumn}
          //
          onSerialize={this.onSerialize}
          tablePlugin={tablePlugin}
        />
        <TextareaAutosize
          className="title"
          placeholder="Title"
          spellCheck={false}
          value={this.state.title}
          onChange={e => {
            const title = e.target.value.replace(/\n/g, "");
            this.setState({ title });
          }}
        />
        <Editor
          // readOnly=false
          spellCheck={false}
          className="article"
          placeholder="Write your thought…"
          plugins={this.plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          renderMark={renderMark}
          schema={schema}
        />
        <Dialog
          visible={this.state.linkDialongShow}
          animation="zoom"
          maskAnimation="fade"
          onClose={() =>
            this.setState({
              linkDialongShow: false
            })
          }
          style={{ width: 400 }}
          mousePosition={this.state.mousePosition}
          destroyOnClose={true}
        >
          <h3>Enter link:</h3>
          <form onSubmit={this.onSubmitLink}>
            <input
              className="input"
              value={this.state.linkValue}
              placeholder="eg: https://framesia.com/"
              onChange={e => this.setState({ linkValue: e.target.value })}
            />
            <input type="submit" className="submit" />
          </form>
          <p
            className="error"
            dangerouslySetInnerHTML={{ __html: this.state.errorLink }}
          />
          <hr />
        </Dialog>
      </div>
    );
  }
}
