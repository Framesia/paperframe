import React, { Component } from "react";
import "./Loader.css";

class Loader extends Component {
  render() {
    return (
      <div className="loading-wrapper">
        <div className="loading-container">
          <div className="swing">
            <div className="swing-l" />
            <div />
            <div />
            <div />
            <div className="swing-r" />
          </div>
          <div className="shadow">
            <div className="shadow-l" />
            <div />
            <div />
            <div />
            <div className="shadow-r" />
          </div>
        </div>
      </div>
    );
  }
}

export default Loader;
