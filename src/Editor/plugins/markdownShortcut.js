const markdownShortcut = () => {
  const getType = (chars) => {
    switch (chars) {
      case "*":
      case "-":
      case "+":
        return "bulleted-item";
      case "1.":
        return "numbered-item";
      case ">":
        return "block-quote";
      case "#":
        return "heading-one";
      case "##":
        return "heading-two";
      case "###":
        return "heading-three";
      // case "```":
      //   return "code-block";
      default:
        return null;
    }
  }

  const onSpace = (event, change) => {
    const { value } = change
    if (value.isExpanded) return

    const { startBlock, startOffset } = value
    const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
    const type = getType(chars)

    if (!type) return
    if (
      (type == 'bulleted-item' && startBlock.type == 'bulleted-item') ||
      (type == 'numbered-item' && startBlock.type == 'numbered-item')
    ) return
    event.preventDefault()

    change.setBlocks(type)

    if (type == 'bulleted-item') {
      change.wrapBlock('bulleted-list')
    } else if (type == 'numbered-item') {
      change.wrapBlock('numbered-list')
    }

    change.extendToStartOf(startBlock).delete()
    return true
  }


  const onBackspace = (event, change) => {
    const { value } = change
    if (value.isExpanded) return
    if (value.startOffset != 0) return

    const { startBlock } = value
    if (startBlock.type == 'paragraph') return

    event.preventDefault()
    change.setBlocks('paragraph')

    if (startBlock.type == "bulleted-item") {
      change.unwrapBlock("bulleted-list");
    } else if (startBlock.type == "numbered-item") {
      change.unwrapBlock("numbered-list");
    }

    return true
  }

  const onEnter = (event, change) => {
    const { value } = change
    if (value.isExpanded) return

    const { startBlock, startOffset, endOffset } = value
    if (startOffset == 0 && startBlock.text.length == 0)
      return onBackspace(event, change)
    if (endOffset != startBlock.text.length) return

    if (
      startBlock.type !== 'heading-one' &&
      startBlock.type !== 'heading-two' &&
      startBlock.type !== 'heading-three' &&
      startBlock.type !== 'heading-four' &&
      startBlock.type !=='heading-five' &&
      startBlock.type !== 'heading-six' &&
      startBlock.type !== 'block-quote'
    ) {
      return
    }

    event.preventDefault()
    change.splitBlock().setBlocks('paragraph')
    return true
  }

  return {
    onKeyDown(event, change) {
      switch (event.key) {
        case ' ':
          return onSpace(event, change)
        case 'Backspace':
          return onBackspace(event, change)
        case 'Enter':
          return onEnter(event, change)
      }
    }
  }
}

export default markdownShortcut