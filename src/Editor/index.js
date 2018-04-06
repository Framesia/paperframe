// Import React!
import React from "react";
import { Value } from "slate";
import { Editor } from "slate-react";

import TextareaAutosize from "react-textarea-autosize";

import Dropdown from "rc-dropdown";
import Dialog from "rc-dialog";

import isUrl from "is-url";

import AutoReplace from "slate-auto-replace";
import SoftBreak from "slate-soft-break";

import serializer from "./serializer";
import initialValue from "./initialValue.json";

import hotKey from "./plugins/hotKey";
import normalize from "./plugins/normalize";

import Icons from "./Icons";

export default class EditorApp extends React.Component {
  state = {
    value: Value.fromJSON(initialValue),
    linkDialongShow: false,
    mousePosition: { x: 0, y: 0 },
    linkValue: "",
    title: "",
    errorLink: ""
  };

  plugins = [
    normalize(this.state.value),
    hotKey({
      key: "b",
      mark: true,
      type: "bold"
    }),
    hotKey({
      key: "`",
      mark: true,
      type: "code"
    }),
    hotKey({
      key: "i",
      mark: true,
      type: "italic"
    }),
    hotKey({
      key: "~",
      mark: true,
      type: "striketrough"
    }),
    hotKey({
      key: "u",
      mark: true,
      type: "underline"
    }),
    hotKey({
      key: "1",
      alt: true,
      node: true,
      type: "heading-one"
    }),
    hotKey({
      key: "2",
      alt: true,
      node: true,
      type: "heading-two"
    }),
    hotKey({
      key: "3",
      alt: true,
      node: true,
      type: "heading-three"
    }),
    hotKey({
      key: "4",
      alt: true,
      node: true,
      type: "block-quote"
    }),
    AutoReplace({
      trigger: "space",
      before: /^(>)$/,
      transform: (transform, e, matches) =>
        transform.setBlocks({
          type: "block-quote"
        })
    }),
    AutoReplace({
      trigger: "space",
      before: /^(#{1,3})$/,
      transform: (transform, e, matches) => {
        const { length } = matches.before[0];
        let type = "heading-one";
        if (length === 2) {
          type = "heading-two";
        } else if (length === 3) {
          type = "heading-three";
        }
        return transform.setBlocks({ type });
      }
    }),
    AutoReplace({
      trigger: "space",
      before: /^(-|\*|\+)$/,
      transform: (transform, e, matches) => {
        return transform
          .setBlocks({ type: "bulleted-item" })
          .wrapBlock({ type: "bulleted-list" });
      }
    }),
    AutoReplace({
      trigger: "space",
      before: /^(1\.)$/,
      transform: (transform, e, matches) => {
        return transform
          .setBlock({ type: "numbered-item" })
          .wrapBlock({ type: "numbered-list" });
      }
    }),
    AutoReplace({
      trigger: "enter",
      before: /^(—-)$/,
      transform: (transform, e, matches) => {
        return transform
          .setBlock({
            type: "divider",
            isVoid: true
          })
          .insertBlock({ type: "paragraph" });
      }
    }),
    AutoReplace({
      trigger: "enter",
      before: /^(```)$/,
      transform: (transform, e, matches) => {
        return transform.setBlock({
          type: "code-block"
        });
      }
    }),
    AutoReplace({
      trigger: '"',
      before: /[^\s]$/,
      transform: (transform, e, matches) => {
        return transform.insertText("”");
      }
    }),
    AutoReplace({
      trigger: '"',
      before: /[\s]{0,}$/,
      transform: (transform, e, matches) => {
        return transform.insertText("“");
      }
    }),
    AutoReplace({
      trigger: "'",
      before: /[^\s]$/,
      transform: (transform, e, matches) => {
        return transform.insertText("“");
      }
    }),
    AutoReplace({
      trigger: "'",
      before: /[\s]{0,}$/,
      transform: (transform, e, matches) => {
        return transform.insertText("“");
      }
    }),
    // mdash
    AutoReplace({
      trigger: "-",
      before: /(\-)$/,
      transform: (transform, e, matches) => {
        return transform.insertText("—");
      }
    }),
    AutoReplace({
      trigger: ".",
      before: /(\.\.)$/,
      transform: (transform, e, matches) => {
        return transform.insertText("…");
      }
    }),
    AutoReplace({
      trigger: /[^A-Z]/,
      before: /([A-Z]{2,})$/,
      // after: /[^A-Z]{0,}/,
      transform: (transform, e, matches) => {
        const textCaps = matches.before[0];
        let triggerChar = e.key;

        if (this.hasMark("small-caps")) {
          transform = transform
            .addMark("small-caps")
            .insertText(textCaps)
            .collapseToEnd();
          if (triggerChar === "Backspace") {
            transform = transform.deleteBackward();
          } else if (triggerChar.length === 1) {
            transform = transform.insertText(triggerChar);
          } else if (triggerChar === "ArrowRight") {
            transform.move(1);
          } else if (triggerChar === "ArrowLeft") {
            transform.move(-1);
          }
          return transform;
        }
        if (triggerChar.length > 1) {
          triggerChar = " ";
        }

        return transform
          .addMark("small-caps")
          .insertText(textCaps)
          .removeMark("small-caps")
          .insertText(triggerChar)
          .collapseToEnd();
        // .removeMark("small-caps")
      }
    }),
    SoftBreak({ shift: true })
  ];

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type == type);
  };

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

  onInsertImage = () => {
    // e.preventDefault();
    const { value } = this.state;
    const change = value.change();
    change
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
      .insertText("caption")
      .collapseToEnd();
    // .expand(4);
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

  renderNode = props => {
    const firstChar = props.node.text[0];
    let HangingDouble = null;
    if (firstChar === "“") {
      HangingDouble = <span className="hanging-double" />;
    }
    switch (props.node.type) {
      case "code-block":
        return <pre {...props.attributes}>{props.children}</pre>;
      case "paragraph":
        return (
          <p {...props.attributes}>
            {HangingDouble}
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
            {props.children}
          </li>
        );
      case "heading-one":
        return (
          <h1 {...props.attributes}>
            {HangingDouble}
            {props.children}
          </h1>
        );
      case "heading-two":
        return (
          <h2 {...props.attributes}>
            {HangingDouble}
            {props.children}
          </h2>
        );
      case "heading-three":
        return (
          <h3 {...props.attributes}>
            {HangingDouble}
            {props.children}
          </h3>
        );
      case "heading-four":
        return (
          <h4 {...props.attributes}>
            {HangingDouble}
            {props.children}
          </h4>
        );
      case "heading-five":
        return (
          <h5 {...props.attributes}>
            {HangingDouble}
            {props.children}
          </h5>
        );
      case "heading-six":
        return (
          <h6 {...props.attributes}>
            {HangingDouble}
            {props.children}
          </h6>
        );
      case "block-quote":
        return (
          <blockquote {...props.attributes}>
            {HangingDouble}
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
        return <img {...props.attributes} src={src} />;
      }
      case "figure": {
        return <figure {...props.attributes}>{props.children}</figure>;
      }
      case "figcaption": {
        return <figcaption {...props.attributes}>{props.children}</figcaption>;
      }
      case "divider":
        return <hr />;
      case "center":
        return <center {...props.attributes}>{props.children}</center>;
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
      case "small-caps":
        return <abbr>{props.children}</abbr>;
      // case "hanging-double":
      //   return <span className="hanging-double">{props.children}</span>;
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
        <button onMouseDown={e => this.onClickBlock(e, "center")}>
          center
        </button>
        <button onMouseDown={e => this.onInsertImage()}>image</button>
      </div>
    );
  };
  render() {
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
          spellCheck={false}
          className="editor"
          placeholder="Write your thought…"
          plugins={this.plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
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
