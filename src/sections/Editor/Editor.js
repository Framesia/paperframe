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

import PostStore from "../../stores/Post";
import Button from "../../components/Button";

import DialogPublish from "./DialogPublish";
import DialogImage from "./DialogImage";
import DialogLink from "./DialogLink";

import root from "window-or-global";

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
    value: root.localStorage.getItem("article-draft-body")
      ? serializer.deserialize(root.localStorage.getItem("article-draft-body"))
      : serializer.deserialize(""),

    linkDialogShow: false,
    imageDialogShow: false,
    publishDialogShow: false,

    mousePosition: { x: 0, y: 0 },

    linkValue: "",
    imageValue: "",

    title: "",

    errorLink: "",
    figureClicked: -1,
    imgUnsplash: []
  };

  componentDidMount() {
    if (root.localStorage.getItem("article-draft-body")) {
      this.setState({
        value: serializer.deserialize(
          root.localStorage.getItem("article-draft-body")
        )
      });
    }
    if (root.localStorage.getItem("article-draft-title")) {
      this.setState({
        title: root.localStorage.getItem("article-draft-title")
      });
    }
  }

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
      console.log(isUrl(text));
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
      root.localStorage.setItem(
        "article-draft-body",
        serializer.serialize(value)
      );
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

  onClickPublish = e => {
    this.setState({
      mousePosition: {
        x: e.pageX,
        y: e.pageY
      },
      publishDialogShow: true
    });
  };

  onSerialize = () => {
    // const { nodes } = this.state.value.toJSON().document
    // const body = serializer.serialize(this.state.value);
    // const title = this.state.title;
    // PostStore.createPost({
    //   body,
    //   title,
    //   category: "test",
    //   tags: ["editor", "test"]
    // });
  };

  onPublishPost = () => {
    const body = serializer.serialize(this.state.value);
    const title = this.state.title;
    PostStore.createPost({
      body,
      title,
      category: "test",
      tags: ["editor", "test"]
    });
  };

  onInsertImage = e => {
    e.preventDefault();
    this.setState({
      mousePosition: {
        x: e.pageX,
        y: e.pageY
      },
      imageDialogShow: true
    });

    // Axios.get(
    //   "https://api.unsplash.com/search/photos?page=1&query=building&client_id=7fc8e95b1f9a8911972fd70d057e667f7a21882b820c4a7d9e495f04a349bac7"
    // ).then(val => {
    //   // console.log(val.data.results);
    //   this.setState({ imgUnsplash: val.data.results });
    // });
  };

  onSubmitImage = data => {
    const { value } = this.state;
    const change = value.change();
    if (isUrl(data)) {
      change.insertInline({
        type: "image",
        isVoid: true,
        data: {
          src: data
        }
      });
      this.setState({ imageDialogShow: false });
      this.onChange(change);
    }
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
        linkDialogShow: true
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
        linkDialogShow: false,
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
          onInsertImage={this.onInsertImage}
          onInsertTable={
            this.onInsertTable //
          }
          onInsertRow={this.onInsertRow}
          onInsertColumn={this.onInsertColumn}
          onRemoveTable={this.onRemoveTable}
          onRemoveRow={this.onRemoveRow}
          onRemoveColumn={this.onRemoveColumn}
          onSerialize={
            this.onSerialize //
          }
          onClickPublish={this.onClickPublish}
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
            root.localStorage.setItem("article-draft-title", title);
          }}
        />
        <Editor
          spellCheck={
            false // readOnly=false
          }
          className="article"
          placeholder="Write your thought…"
          plugins={this.plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          renderMark={renderMark}
          schema={schema}
        />
        {/* link dialog */}
        <DialogLink
          linkDialogShow={this.state.linkDialogShow}
          onSubmitLink={this.onSubmitLink}
          onChangeLink={linkValue => this.setState({ linkValue })}
          errorLink={this.state.errorLink}
          onClose={() => this.setState({ linkDialogShow: false })}
          mousePosition={this.state.mousePosition}
        />

        {/* image dialog */}
        <DialogImage
          imageDialogShow={this.state.imageDialogShow}
          onSubmitImage={this.onSubmitImage}
          onClose={() => this.setState({ imageDialogShow: false })}
          mousePosition={this.state.mousePosition}
        />

        {/* publish dialog */}
        <DialogPublish
          valueBody={this.state.value}
          publishDialogShow={this.state.publishDialogShow}
          onClose={() => this.setState({ publishDialogShow: false })}
          mousePosition={this.state.mousePosition}
          dataBody={serializer.serialize(this.state.value)}
        />
      </div>
    );
  }
}
