import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Editor from './Editor/'

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <Editor />
      </div>
    );
  }
}

export default App;
