const markdownShortcut = () => {
  const getType = (chars) => {
    switch (chars) {
      case "*":
      case "-":
      case "+":
        return "list-item";
      // case ">":
      //   return "block-quote";
      // case "#":
      //   return "heading-one";
      // case "##":
      //   return "heading-two";
      // case "###":
      //   return "heading-three";
      // case "####":
      //   return "heading-four";
      // case "#####":
      //   return "heading-five";
      // case "######":
      //   return "heading-six";
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
    if (type == 'list-item' && startBlock.type == 'list-item') return
    event.preventDefault()

    change.setBlocks(type)

    if (type == 'list-item') {
      change.wrapBlock('bulleted-list')
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

    if (startBlock.type == 'list-item') {
      change.unwrapBlock('bulleted-list')
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