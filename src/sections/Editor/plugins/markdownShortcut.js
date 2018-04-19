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
      // before: /^(```([a-z0-9-]{0,15}))$/,
      transform: (transform, e, matches) => {
        // const language = matches.before[2];

        return codePlugin.changes.wrapCodeBlock(transform).focus();
      }
    }),
    AutoReplace({
      trigger: '"',
      before: /[^\s]$/,
      transform: (transform, e, matches) => {
        return transform.insertText("”");
      },
      ignoreIn: ["code-block", "code-line"]
    }),
    AutoReplace({
      trigger: '"',
      before: /[\s]{0,}$/,
      transform: (transform, e, matches) => {
        return transform.insertText("“");
      },
      ignoreIn: ["code-block", "code-line"]
    }),
    AutoReplace({
      trigger: "'",
      before: /[^\s]$/,
      transform: (transform, e, matches) => {
        return transform.insertText("’");
      },
      ignoreIn: ["code-block", "code-line"]
    }),
    AutoReplace({
      trigger: "'",
      before: /[\s]{0,}$/,
      transform: (transform, e, matches) => {
        return transform.insertText("‘");
      },
      ignoreIn: ["code-block", "code-line"]
    }),
    AutoReplace({
      // mdash
      trigger: "-",
      before: /(\-)$/,
      transform: (transform, e, matches) => {
        return transform.insertText("—");
      },
      ignoreIn: ["code-block", "code-line"]
    }),
    AutoReplace({
      trigger: ".",
      before: /(\.\.)$/,
      transform: (transform, e, matches) => {
        return transform.insertText("…");
      },
      ignoreIn: ["code-block", "code-line"]
    })
  ];
}
