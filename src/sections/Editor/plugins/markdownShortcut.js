import AutoReplace from "slate-auto-replace";

export default function shortcut({ hasMark, listPlugin, codePlugin }) {
  return [
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
        return listPlugin.changes.wrapInList(transform, "bulleted-list");
      }
    }),
    AutoReplace({
      trigger: "space",
      before: /^(1\.)$/,
      transform: (transform, e, matches) => {
        return listPlugin.changes.wrapInList(transform, "numbered-list");
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
        return codePlugin.changes.wrapCodeBlock(transform).focus();
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
        return transform.insertText("’");
      }
    }),
    AutoReplace({
      trigger: "'",
      before: /[\s]{0,}$/,
      transform: (transform, e, matches) => {
        return transform.insertText("‘");
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
    })
    // AutoReplace({
    //   trigger: /[^A-Z]/,
    //   before: /([A-Z]{2,})$/,
    //   // after: /[^A-Z]{0,}/,
    //   transform: (transform, e, matches) => {
    //     const textCaps = matches.before[0];
    //     let triggerChar = e.key;
    //     // const hasSmallCaps = transform.value.activeMarks.some(
    //     //   mark => mark.type == "small-caps"
    //     // );
    //     console.log(hasMark);

    //     if (hasMark("small-caps")) {
    //       transform = transform
    //         .addMark("small-caps")
    //         .insertText(textCaps)
    //         .collapseToEnd();
    //       if (triggerChar === "Backspace") {
    //         transform = transform.deleteBackward();
    //       } else if (triggerChar.length === 1) {
    //         transform = transform.insertText(triggerChar);
    //       } else if (triggerChar === "ArrowRight") {
    //         transform.move(1);
    //       } else if (triggerChar === "ArrowLeft") {
    //         transform.move(-1);
    //       }
    //       return transform;
    //     }
    //     if (triggerChar.length > 1) {
    //       triggerChar = " ";
    //     }

    //     return transform
    //       .addMark("small-caps")
    //       .insertText(textCaps)
    //       .removeMark("small-caps")
    //       .insertText(triggerChar)
    //       .collapseToEnd();
    //     // .removeMark("small-caps")
    //   }
    // })
  ];
}
