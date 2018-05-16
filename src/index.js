import React from "react";
import ReactDOM from "react-dom";
// import { hydrate, render } from "react-dom";
import "./index.css";
import "./sanitize.css";
import App from "./App";
import registerServiceWorker, { unregister } from "./registerServiceWorker";

import { BrowserRouter } from "react-router-dom";

ReactDOM.hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
unregister();
