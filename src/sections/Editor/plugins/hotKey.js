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

export default [
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
  })
];
