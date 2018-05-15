import React, { Component } from "react";

import renderToHTML from "../sections/Renderer/renderToHTML";

import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-go";
import "prismjs/components/prism-php";

import detectLang from "../utils/detectLang";
import root from "window-or-global";

var loadLanguages = require("prismjs/components/index.js");
loadLanguages(["c", "cpp", "python", "java", "ruby", "go", "php"]);

class TestRenderPage extends Component {
  componentDidMount() {
    setTimeout(() => {
      const pres = Array.from(
        root.document.querySelectorAll("pre code")
      ).map(code => {
        const text = code.innerText;
        let lang = detectLang(text).toLowerCase();
        if (lang === "unknown") {
          lang = "";
        }
        if (lang === "c++") {
          lang = "cpp";
        }
        const html = Prism.highlight(text, Prism.languages[lang], lang);
        code.innerHTML = html;
      });
    }, 10);
  }

  render() {
    const data = {
      body: root.localStorage.getItem("article-draft-body"),
      json_metadata: {
        links: [],
        users: [],
        image: []
      },
      imageSizes: []
    };
    return (
      <div
        style={{
          maxWidth: 640,
          margin: "20px auto"
        }}
      >
        <div className="article">
          <div dangerouslySetInnerHTML={{ __html: renderToHTML(data) }} />
        </div>
      </div>
    );
  }
}

export default TestRenderPage;
