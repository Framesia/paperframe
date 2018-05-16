const path = require("path");
const fs = require("fs");

const React = require("react");
const { renderToString } = require("react-dom/server");
const { StaticRouter } = require("react-router-dom");

import { ServerStyleSheet, StyleSheetManager } from "styled-components";

const sheet = new ServerStyleSheet();

const { default: App } = require("../src/App");

import Helmet from "react-helmet";

module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, "..", "build", "index.html");

  fs.readFile(filePath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("read err", err);
      return res.status(404).end();
    }
    const context = {};
    const markup = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </StyleSheetManager>
    );

    const helmet = Helmet.renderStatic();
    const styleTags = sheet.getStyleTags();

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      res.redirect(301, context.url);
    } else {
      // we're good, send the response
      const RenderedApp = htmlData
        .replace("{{SSR}}", markup)
        .replace("{{STYLED}}", styleTags)
        .replace("{{HELMET-TITLE}}", helmet.title.toString())
        .replace("{{HELMET-META}}", helmet.meta.toString())
        .replace("{{HELMET-LINK}}", helmet.link.toString())
        .replace("{{html-attr}}", helmet.htmlAttributes.toString())
        .replace("{{body-attr}}", helmet.bodyAttributes.toString())
        .replace(
          "{{STATE}}",
          `<script>window.STATE = ${JSON.stringify(req.state)}</script>`
        );
      res.send(RenderedApp);
    }
  });
};
