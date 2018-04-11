// Import React!
import React from "react";
import { Value } from "slate";
import { Editor } from "slate-react";

import { Client } from "dsteem";

import TextareaAutosize from "react-textarea-autosize";

import Dropdown from "rc-dropdown";
import Dialog from "rc-dialog";

import isUrl from "is-url";

import SoftBreak from "slate-soft-break";
import PluginEditTable from "slate-edit-table";

import serializer from "./serializer";
import initialValue from "./initialValue.json";

import Icons from "./Icons";
import schema from "./schema";

import normalize from "./plugins/normalize";
import hotKey from "./plugins/hotKey";
import markdownShortcut from "./plugins/markdownShortcut";

import Remarkable from "remarkable";
const client = new Client("https://api.steemit.com");

const tablePlugin = PluginEditTable({
  typeRow: "table-row",
  typeCell: "table-cell",
  exitBlockType: "enter"
});

export default class EditorApp extends React.Component {
  state = {
    value: serializer.deserialize(
      ""
      // `<p>ini <a href="http://google.com">adalah</a> test</p><figure><img src="https://cdn-enterprise.discourse.org/imgur/uploads/default/original/3X/9/4/946841767587979b888acd2c2e6f6a99982ff68a.jpg"/><figcaption>caption</figcaption></figure>`
    ),
    linkDialongShow: false,
    mousePosition: { x: 0, y: 0 },
    linkValue: "",
    title: "",
    errorLink: "",
    figureClicked: -1
  };

  componentDidMount() {
    const md = new Remarkable({
      html: true,
      breaks: false,
      linkify: true, // linkify is done locally
      typographer: true, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
      quotes: "“”‘’"
    });
    client.database
      .getDiscussions("trending", {
        tag: "steemstem",
        limit: 1
      })
      .then(data => {
        let value = md.render(data[0].body);
        // value = value.replace(/<p>(<br ?\/>){0,}<\/p>/g, "");
        // console.log(value);
        this.setState({
          value: serializer.deserialize(value)
        });
      });
  }

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

  plugins = [
    tablePlugin,
    normalize(this.state.value),
    ...hotKey,
    ...markdownShortcut(this.hasMark),
    SoftBreak({ shift: true })
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
    const change = value.change();
    const { document } = value;

    if (type == "center") {
      const isActive = value.fragment.nodes.some(node => node.type == type);
      if (isActive) {
        change.unwrapBlock("center");
      } else {
        change.wrapBlock("center");
      }
    } else if (type != "bulleted-list" && type != "numbered-list") {
      // Handle everything but list buttons. and center
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        change
          .setBlocks(isActive ? "paragraph" : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        change.setBlocks(isActive ? "paragraph" : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type);
      });

      if (isList && isType) {
        change
          .setBlocks("paragraph")
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        change
          .unwrapBlock(
            type == "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        change.setBlocks("list-item").wrapBlock(type);
      }
    }

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
    change
      // .insertBlock({ type: figure})
      .insertBlock({
        type: "image",
        isVoid: true,
        data: {
          src:
            "https://cdn-enterprise.discourse.org/imgur/uploads/default/original/3X/9/4/946841767587979b888acd2c2e6f6a99982ff68a.jpg"
        }
      })
      .wrapBlock("figure")
      .insertBlock("figcaption")
      .insertText("image caption")
      .collapseToEnd()
      .focus()
      .extend(-13);
    this.onChange(change);
  };

  onInsertTable = e => {
    e.preventDefault();
    const change = tablePlugin.changes.insertTable(this.state.value.change());
    this.onChange(change);
  };
  onRemoveTable = e => {
    e.preventDefault();
    try {
      const change = tablePlugin.changes.removeTable(this.state.value.change());
      this.onChange(change.insertBlock("paragraph"));
    } catch (e) {}
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

  renderNode = props => {
    const firstChar = props.node.text[0];
    let HangingDouble = null;
    let HangingSingle = null;
    if (firstChar === "“" || firstChar === '"') {
      HangingDouble = <span className="hanging-double" />;
    }
    if (firstChar === "'" || firstChar === "‘") {
      HangingSingle = <span className="hanging-single" />;
    }
    switch (props.node.type) {
      case "code-block":
        return <pre {...props.attributes}>{props.children}</pre>;
      case "paragraph":
        let readOnly = true;
        if (readOnly) {
          if (/^\s+$/.test(props.node.text)) {
            return null;
          }
        }
        return (
          <p {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </p>
        );
      case "bulleted-list":
        return <ul {...props.attributes}>{props.children}</ul>;
      case "numbered-list":
        return <ol {...props.attributes}>{props.children}</ol>;
      case "bulleted-item":
        return <li {...props.attributes}>{props.children}</li>;
      case "numbered-item":
        return (
          <li {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </li>
        );
      case "heading-one":
        return (
          <h1 {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </h3>
        );
      case "heading-four":
        return (
          <h4 {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </h4>
        );
      case "heading-five":
        return (
          <h5 {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </h5>
        );
      case "heading-six":
        return (
          <h6 {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </h6>
        );
      case "block-quote":
        return (
          <blockquote {...props.attributes}>
            {HangingDouble}
            {HangingSingle}
            {props.children}
          </blockquote>
        );
      case "link": {
        const { data } = props.node;
        const href = data.get("href");
        return (
          <a {...props.attributes} href={href}>
            {props.children}
          </a>
        );
      }
      case "image": {
        const { data } = props.node;
        const src = data.get("src");
        return (
          <img
            {...props.attributes}
            draggable={false}
            style={{ cursor: "pointer" }}
            src={`https://steemitimages.com/0x0/${src}`}
          />
        );
      }
      case "figure": {
        const firstChildType = props.node
          .get("nodes")
          .get("0")
          .get("type");
        if (firstChildType !== "image") {
          return null;
        }
        return <figure {...props.attributes}>{props.children}</figure>;
      }
      case "figcaption": {
        return <figcaption {...props.attributes}>{props.children}</figcaption>;
      }
      case "divider":
        return <hr />;
      case "center":
        return <center {...props.attributes}>{props.children}</center>;
      case "table":
        return (
          <table border={1}>
            <tbody {...props.attributes}>{props.children}</tbody>
          </table>
        );
      case "table-row":
        return <tr {...props.attributes}>{props.children}</tr>;
      case "table-cell":
        return <td {...props.attributes}>{props.children}</td>;
      case "div":
        const pull = props.node.data.get("pull");
        return (
          <div className={pull && `pull-${pull}`} {...props.attributes}>
            {props.children}
          </div>
        );
    }
  };

  renderMark = props => {
    switch (props.mark.type) {
      case "bold":
        return <strong>{props.children}</strong>;
      case "italic":
        return <em>{props.children}</em>;
      case "code":
        return <code>{props.children}</code>;
      case "strikethrough":
        return <del>{props.children}</del>;
      case "underline":
        return <u>{props.children}</u>;
      // case "small-caps":
      //   return <abbr>{props.children}</abbr>;
    }
  };

  renderToolbar = () => {
    const Mark = type => (
      <button
        className={this.hasMark(type) ? "active" : ""}
        onMouseDown={e => this.onClickMark(e, type)}
      >
        <Icons type={type} />
      </button>
    );

    const Node = (type, text) => (
      <div className={type} onMouseDown={e => this.onClickBlock(e, { type })}>
        {text}
      </div>
    );
    let textBlock = "Paragraph";
    let block = "paragraph";
    if (this.hasBlock("heading-one")) {
      block = "heading-one";
      textBlock = "Big header";
    } else if (this.hasBlock("heading-two")) {
      block = "heading-two";
      textBlock = "Medium header";
    } else if (
      this.hasBlock("heading-three") ||
      this.hasBlock("heading-four") ||
      this.hasBlock("heading-five") ||
      this.hasBlock("heading-six")
    ) {
      block = "heading-three";
      textBlock = "Small header";
    } else if (this.hasBlock("block-quote")) {
      block = "block-quote";
      textBlock = "Quote";
    } else if (this.hasBlock("code-block")) {
      block = "code-block";
      textBlock = "Code block";
    }

    const isInTable = tablePlugin.utils.isSelectionInTable(this.state.value);
    return (
      <div className="toolbar">
        <div className="toolbar-group">
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
            animation="slide-up"
            onVisibleChange={e => console.log(e)}
          >
            <div className="dropdown">
              <div className={block} style={{ width: 160 }}>
                {textBlock}
              </div>
            </div>
          </Dropdown>
        </div>
        <div className="toolbar-group">
          {Mark("bold")}
          {Mark("italic")}
          {Mark("underline")}
        </div>
        <div className="toolbar-group">
          {Mark("code")}
          <button
            className={
              this.state.value.inlines.some(inline => inline.type == "link")
                ? "active"
                : ""
            }
            onMouseDown={this.onClickLink}
          >
            <Icons type="link" />
          </button>
        </div>
        <button onMouseDown={this.onSerialize}>serialize</button>
        {!isInTable && (
          <React.Fragment>
            <button onMouseDown={e => this.onClickBlock(e, "center")}>
              center
            </button>
            <button onMouseDown={e => this.onInsertImage(e)}>image</button>
            <button onMouseDown={e => this.onInsertTable(e)}>table</button>
          </React.Fragment>
        )}
        {isInTable && (
          <button onMouseDown={e => this.onRemoveTable(e)}>delete table</button>
        )}
      </div>
    );
  };
  render() {
    // console.log(this.state);
    return (
      <div>
        {this.renderToolbar()}
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
          readOnly
          spellCheck={false}
          className="editor"
          placeholder="Write your thought…"
          plugins={this.plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
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
