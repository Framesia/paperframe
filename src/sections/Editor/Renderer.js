import React, { Component } from "react";

import { Editor } from "slate-react";

import SoftBreak from "slate-soft-break";
import PluginEditTable from "slate-edit-table";
import PluginEditList from "slate-edit-list";
import PluginEditCode from "slate-edit-code";
import PluginPrism from "slate-prism";

import normalize from "./plugins/normalize";
import hotKey from "./plugins/hotKey";
import markdownShortcut from "./plugins/markdownShortcut";

import serializer from "./serializer";
import renderMark from "./renderMark";
import renderNode from "./renderNode";
import schema from "./schema";

import detectLang from "../../utils/detectLang";

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
const prismPlugin = PluginPrism({
  onlyIn: node => node.type === "code-block",
  getSyntax: node => {
    const lang = detectLang(node.text).toLowerCase();
    if (lang === "unknown") {
      return "";
    }
    if (lang === "c++") {
      return "cpp";
    }
    return lang;
    // return "javascript";
  }
});

class Renderer extends Component {
  state = {
    value: serializer.deserialize(this.props.value)
  };
  plugins = [
    codePlugin,
    tablePlugin,
    listPlugin,
    prismPlugin,
    //
    ...hotKey,
    ...markdownShortcut({ hasMark: this.hasMark, listPlugin, codePlugin }),
    //
    SoftBreak({ shift: true }),
    normalize(this.state.value)
  ];
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };
  onChange = ({ value }) => {
    // const { value } = this.state;
    const regex = /[A-Z]{2,}/g;
    const texts = value.document.getTexts();
    const decorations = [];

    texts.forEach(node => {
      const { key, text } = node;
      const parts = text.split(regex);
      let offset = 0;
      const matches = text.match(regex);
      // console.log(matches);
      if (matches) {
        parts.forEach((part, i) => {
          // console.log(parts, matches);
          if (i != 0) {
            decorations.push({
              anchorKey: key,
              anchorOffset: offset,
              focusKey: key,
              focusOffset: offset + matches[i - 1].length,
              marks: [{ type: "small-caps" }]
            });
            offset = offset + part.length + matches[i - 1].length;
          } else {
            offset = offset + part.length;
          }
        });
      }
      // window.localStorage.setItem(
      //   "article-draft-body",
      //   serializer.serialize(value)
      // );
    });

    const change = value
      .change()
      .setOperationFlag("save", false)
      .setValue({ decorations })
      .setOperationFlag("save", true);

    this.setState({ value: change.value });
  };
  render() {
    return (
      <div>
        <Editor
          readOnly
          className="article"
          plugins={this.plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          renderMark={renderMark}
          schema={schema}
        />
      </div>
    );
  }
}

export default Renderer;
