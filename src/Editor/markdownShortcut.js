const markdownShortcut = () => {
  const getType = (chars) => {
    switch (chars) {
      case "*":
      case "-":
      case "+":
        return "list-item";
      case ">":
        return "block-quote";
      case "#":
        return "heading-one";
      case "##":
        return "heading-two";
      case "###":
        return "heading-three";
      case "####":
        return "heading-four";
      case "#####":
        return "heading-five";
      case "######":
        return "heading-six";
      default:
        return null;
    }
  }

  return {
    onKeyDown = (event, change) => {
      switch (event.key) {
        case ' ':
          return this.onSpace(event, change)
        case 'Backspace':
          return this.onBackspace(event, change)
        case 'Enter':
          return this.onEnter(event, change)
      }
    }
  }
}

export default markdownShortcut