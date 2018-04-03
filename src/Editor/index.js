// Import React!
import React from "react";
import { Value } from "slate";
import { Editor } from "slate-react";

import AutoReplace from "slate-auto-replace";
import SoftBreak from "slate-soft-break";

import serializer from "./serializer";
import initialValue from "./initialValue.json";

import hotKey from "./plugins/hotKey";
import normalize from "./plugins/normalize";
// import softBreak from './plugins/softBreak';
// import link from './plugins/link';

import Icons from "./Icons";

// import isUrl from 'is-url'

export default class EditorApp extends React.Component {
  state = { value: Value.fromJSON(initialValue) };

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
      mark: true
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
      before: /^(1.)$/,
      transform: (transform, e, matches) => {
        return transform
          .setBlock({ type: "numbered-item" })
          .wrapBlock({ type: "numbered-list" });
      }
    }),
    AutoReplace({
      trigger: "enter",
      before: /^(---)$/,
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
    }), // markdownShortcut(),
    // softBreak(),
    // link()
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

    // Handle everything but list buttons.
    if (type != "bulleted-list" && type != "numbered-list") {
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

  onClickLink = e => {
    e.preventDefault();
    const { value } = this.state;
    const hasLinks = value.inlines.some(inline => inline.type == "link");
    const change = value.change();

    if (hasLinks) {
      change.unwrapInline("link");
    } else if (value.isExpanded) {
      const href = window.prompt("Enter the URL of the link:");
      change.wrapInline({
        type: "link",
        data: { href }
      });
      change.collapseToEnd();
      // } else {
      //   const href = window.prompt('Enter the URL of the link:')
      //   const text = window.prompt('Enter the text for the link:')
      //   change
      //     .insertText(text)
      //     .extend(0 - text.length)
      //     .wrapInline({ type: "link", data: { href } });
    }

    this.onChange(change);
  };

  renderNode = props => {
    switch (props.node.type) {
      case "code-block":
        return <pre {...props.attributes}>{props.children}</pre>;
      case "paragraph":
        return <p {...props.attributes}>{props.children}</p>;
      case "bulleted-list":
        return <ul {...props.attributes}>{props.children}</ul>;
      case "numbered-list":
        return <ol {...props.attributes}>{props.children}</ol>;
      case "bulleted-item":
        return <li {...props.attributes}>{props.children}</li>;
      case "numbered-item":
        return <li {...props.attributes}>{props.children}</li>;
      case "heading-one":
        return <h1 {...props.attributes}>{props.children}</h1>;
      case "heading-two":
        return <h2 {...props.attributes}>{props.children}</h2>;
      case "heading-three":
        return <h3 {...props.attributes}>{props.children}</h3>;
      case "heading-four":
        return <h4 {...props.attributes}>{props.children}</h4>;
      case "heading-five":
        return <h5 {...props.attributes}>{props.children}</h5>;
      case "heading-six":
        return <h6 {...props.attributes}>{props.children}</h6>;
      case "block-quote":
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
      case "link": {
        const { data } = props.node;
        const href = data.get("href");
        return (
          <a {...props.attributes} href={href}>
            {props.children}
          </a>
        );
      }
      case "divider":
        return <hr />;
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
    let block = "paragraph";
    if (this.hasBlock("heading-one")) {
      block = "heading-one";
    } else if (this.hasBlock("heading-two")) {
      block = "heading-two";
    } else if (
      this.hasBlock("heading-three") ||
      this.hasBlock("heading-four") ||
      this.hasBlock("heading-five") ||
      this.hasBlock("heading-six")
    ) {
      block = "heading-three";
    } else if (this.hasBlock("block-quote")) {
      block = "block-quote";
    }
    return (
      <div className="toolbar">
        <div className="toolbar-group">
          <select
            value={block}
            onChange={e => this.onClickBlock(e, e.target.value)}
          >
            <option value="paragraph">
              <p>Paragraph</p>
            </option>
            <option value="heading-one">
              <h1>Big Header</h1>
            </option>
            <option value="heading-two">Medium Header</option>
            <option value="heading-three">Small Header</option>
            <option value="block-quote">Quote</option>
          </select>
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
            link
          </button>
        </div>
        <button onMouseDown={this.onSerialize}>serialize</button>
      </div>
    );
  };
  render() {
    return (
      <div>
        {this.renderToolbar()}
        <Editor
          spellCdheck={false}
          className="editor"
          placeholder="Write your thought..."
          plugins={this.plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    );
  }
}
