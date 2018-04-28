// Import React!
import React from "react";
import { Value } from "slate";
import { Editor } from "slate-react";

import TextareaAutosize from "react-textarea-autosize";

import Dropdown from "rc-dropdown";
import Dialog from "rc-dialog";

import isUrl from "is-url";

import serializer from "./serializer";
import initialValue from "./initialValue.json";

import Icons from "./Icons";
import schema from "./schema";

import detectLang from "../../utils/detectLang";

import SoftBreak from "slate-soft-break";
import PluginEditTable from "slate-edit-table";
import PluginEditList from "slate-edit-list";
import PluginEditCode from "slate-edit-code";
import PluginPrism from "slate-prism";

import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-go";
import "prismjs/components/prism-php";

import normalize from "./plugins/normalize";
import hotKey from "./plugins/hotKey";
import markdownShortcut from "./plugins/markdownShortcut";

import renderNode from "./renderNode";
import renderMark from "./renderMark";

import Toolbar from "./Toolbar";
import Axios from "axios";

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

export default class EditorApp extends React.Component {
  state = {
    value: serializer.deserialize(""),
    linkDialongShow: false,
    mousePosition: { x: 0, y: 0 },
    linkValue: "",
    title: "",
    errorLink: "",
    figureClicked: -1,
    imgUnsplash: []
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
    prismPlugin,
    //
    ...hotKey,
    ...markdownShortcut({ hasMark: this.hasMark, listPlugin, codePlugin }),
    //
    SoftBreak({ shift: true }),
    normalize(this.state.value)
  ];

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  hasFragment = type => {
    const { value } = this.state;
    return value.fragment.nodes.some(node => {
      if (node.type === type) {
        return true;
      } else {
        if (node.nodes) {
          return node.nodes.some(node => node.type === type);
        }
      }
    });
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
    });

    const change = value
      .change()
      .setOperationFlag("save", false)
      .setValue({ decorations })
      .setOperationFlag("save", true);

    this.setState({ value: change.value });
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
      node => node.type === "center"
    );
    const isPullLeftActive = value.fragment.nodes.some(
      node => node.type === "pull-left"
    );
    const isPullRightActive = value.fragment.nodes.some(
      node => node.type === "pull-right"
    );
    console.log(isPullLeftActive, isCenterActive, isPullRightActive);
    if (type === "pull-left") {
      if (isPullLeftActive) {
        change.unwrapBlock("pull-left");
      } else if (isPullRightActive) {
        change.unwrapBlock("pull-right");
        change.wrapBlock("pull-left");
      } else {
        change.wrapBlock("pull-left");
      }
    } else if (type === "pull-right") {
      if (isPullRightActive) {
        change.unwrapBlock("pull-right");
      } else if (isPullLeftActive) {
        change.unwrapBlock("pull-left");
        change.wrapBlock("pull-right");
      } else {
        change.wrapBlock("pull-right");
      }
    } else if (type === "center") {
      // if ()
      // console.log(value.fragment.nodes.toJSON);
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
    this.onChange(change);
  };

  onSerialize = () => {
    // const { nodes } = this.state.value.toJSON().document
    console.log(serializer.serialize(this.state.value));
  };

  onInsertImage = e => {
    e.preventDefault();
    this.setState({
      mousePosition: {
        x: e.pageX,
        y: e.pageY
      },
      imgDialongShow: true
    });

    Axios.get(
      "https://api.unsplash.com/search/photos?page=1&query=building&client_id=7fc8e95b1f9a8911972fd70d057e667f7a21882b820c4a7d9e495f04a349bac7"
    ).then(val => {
      // console.log(val.data.results);
      this.setState({ imgUnsplash: val.data.results });
    });
  };

  onSubmitImage = data => {
    const { value } = this.state;
    const change = value.change();
    change.insertInline({
      type: "image",
      isVoid: true,
      data: {
        src: data.urls.small
      }
    });
    this.setState({ imgDialongShow: false });
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
      // .blur();s
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
          hasFragment={this.hasFragment}
          onClickBlock={this.onClickBlock}
          onClickLink={this.onClickLink}
          onClickMark={this.onClickMark}
          onInsertImage={this.onInsertImage} //
          onInsertTable={this.onInsertTable}
          onInsertRow={this.onInsertRow}
          onInsertColumn={this.onInsertColumn}
          onRemoveTable={this.onRemoveTable}
          onRemoveRow={this.onRemoveRow}
          onRemoveColumn={this.onRemoveColumn} //
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
        <Editor // readOnly=false
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

        <Dialog
          visible={this.state.imgDialongShow}
          animation="zoom"
          maskAnimation="fade"
          onClose={() =>
            this.setState({
              imgDialongShow: false
            })
          }
          style={{ width: 740 }}
          mousePosition={this.state.mousePosition}
          destroyOnClose={true}
        >
          <h3>Enter img:</h3>
          <div>
            {this.state.imgUnsplash.map(item => (
              <img
                style={{ margin: 10 }}
                src={item.urls.thumb}
                onClick={() => this.onSubmitImage(item)}
              />
            ))}
          </div>
          <hr />
        </Dialog>
      </div>
    );
  }
}
