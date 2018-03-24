// Import React!
import React from "react";
import { Editor } from "slate-react";
import { Value } from "slate";
import hotKey from './hotKey';
import serializer from './serializer'
import initialValue from './initialValue.json'

const CodeBlockNode = (props) => (
  <pre {...props.attributes}>
    <code>{props.children}</code>
  </pre>
)

const ParagraphNode = (props) => (
  <p {...props.attributes}>{props.children}</p>
)

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
    hotKey({ key: '1', node: true, type: 'code' }),
  ]
 
  onChange = ({ value }) => {
    this.setState({ value })
  }

  onSerialize = () => {
    // const { nodes } = this.state.value.toJSON().document
    console.log(serializer.serialize(this.state.value))
  }

  renderNode = (props) => {
    switch (props.node.type) {
      case 'code':
        return <CodeBlockNode {...props} />
      case 'paragraph':
        return <ParagraphNode {...props} />
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
        <button onClick={this.onSerialize}>Serialize</button>
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
