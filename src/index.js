import React from "react";
// import ReactDOM from "react-dom";
import { hydrate, render } from "react-dom";
import "./index.css";
import "./sanitize.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
