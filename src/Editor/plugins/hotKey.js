const hotKey = options => {
  const { type, key, mark, node, alt } = options;
  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, change) {
      // Check that the key pressed matches our `key` option.
      if (!event.ctrlKey || event.key != key) return;
      // Prevent the default characters from being inserted.
      event.preventDefault();
      if (mark) {
        // Toggle the mark `type`.
        change.toggleMark(type);
      }
      if (node) {
        const isType = change.value.blocks.some(block => block.type === type);
        if (alt) {
          if (event.altKey) {
            change.setBlocks(isType ? "paragraph" : type);
          }
        } else {
          change.setBlocks(isType ? "paragraph" : type);
        }
      }
      return true;
    }
  };
};

export default hotKey;
