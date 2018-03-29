// Import React!
import React from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import serializer from './serializer'
import initialValue from './initialValue.json'

import hotKey from './plugins/hotKey';
import markdownShortcut from './plugins/markdownShortcut';
import softBreak from './plugins/softBreak';
import link from './plugins/link';

// import isUrl from 'is-url'

export default class EditorApp extends React.Component {
  
  state = {
    value: Value.fromJSON(initialValue),
  }

  plugins = [
    hotKey({ key: 'b', mark: true, type: 'bold' }),
    hotKey({ key: '`', mark: true, type: 'code' }),
    hotKey({ key: 'i', mark: true, type: 'italic' }),
    hotKey({ key: '~', mark: true, type: 'strikethrough' }),
    hotKey({ key: 'u', mark: true, type: 'underline' }),
    hotKey({ key: '1', node: true, type: 'code-block' }),
    markdownShortcut(),
    softBreak(),
    link()
  ]
   
  onChange = ({ value }) => {
    this.setState({ value })
  }

  onClickMark = (e, type) => {
    e.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  onSerialize = () => {
    // const { nodes } = this.state.value.toJSON().document
    console.log(serializer.serialize(this.state.value))
  }

  onClickLink = event => {
    event.preventDefault()
    const { value } = this.state
    const hasLinks = value.inlines.some(inline => inline.type == "link");
    const change = value.change()

    if (hasLinks) {
      change.unwrapInline("link");
    } else if (value.isExpanded) {
      const href = window.prompt('Enter the URL of the link:')
      change.wrapInline({ type: "link", data: { href } });
      change.collapseToEnd();
    } else {
      const href = window.prompt('Enter the URL of the link:')
      const text = window.prompt('Enter the text for the link:')
      change
        .insertText(text)
        .extend(0 - text.length)
        .wrapInline({ type: "link", data: { href } });
    }

    this.onChange(change)
  }

  renderNode = (props) => {
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
        return <a {...props.attributes} href={href}>{props.children}</a>;
      }
    }
  }

  renderMark = (props) => {
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
  }
 
  render() {
    return (
      <div>
        <button onMouseDown={(e) => this.onClickMark(e, 'bold')}><b>B</b></button>
        <button onMouseDown={(e) => this.onClickMark(e, 'italic')}><i>i</i></button>
        <button onMouseDown={(e) => this.onClickMark(e, 'underline')}><u>u</u></button>
        <button onMouseDown={(e) => this.onClickMark(e, 'code')}>code</button>
        <button onMouseDown={this.onClickLink}>link</button>
        <br />
        <button onMouseDown={this.onSerialize}>serialize</button>
        <Editor
          plugins={this.plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />

      </div>
    )
  }
}
