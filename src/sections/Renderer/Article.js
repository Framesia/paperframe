import React, { Component } from "react";

import Remarkable from "remarkable";

import { Client } from "dsteem";
const client = new Client("https://api.steemit.com");

class Renderer extends Component {
  state = {
    value: ""
  };
  componentDidMount() {
    const md = new Remarkable({
      html: true,
      breaks: false,
      linkify: false, // linkify is done locally
      typographer: true, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
      quotes: "“”‘’"
    });
    client.database
      .getDiscussions("trending", { tag: "art", limit: 1 })
      .then(data => {
        const post = data[0];
        let value = post.body;
        let metadata = {};

        const randomId = Math.floor(Math.random() * 1000);

        metadata = JSON.parse(post.json_metadata);

        let { image, links, users } = metadata;
        image = image ? image.reverse() : [];
        links = links ? links.reverse() : [];
        users = users ? users.reverse() : [];

        function escapeRegExp(str) {
          return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        image.forEach((img, i) => {
          value = value.replace(
            new RegExp(escapeRegExp(img), "g"),
            randomId + "-img-" + i + "-"
          );
        });
        links.forEach((link, i) => {
          value = value.replace(
            new RegExp(escapeRegExp(link), "g"),
            randomId + "-link-" + i + "-"
          );
        });
        users.forEach((user, i) => {
          value = value.replace(
            new RegExp(escapeRegExp("@" + user), "g"),
            randomId + "-user-" + i + "-"
          );
        });
        console.log(value);

        value = md.render(value);

        value = value.replace(/\<img (.+)?src=("|')(.+?)("|').+?\/?>/g, "$3");
        image.forEach((img, i) => {
          value = value.replace(
            new RegExp(randomId + "-img-" + i + "-", "g"),
            `<img src="https://steemitimages.com/640x2000/${img}" />`
          );
        });
        links.forEach((link, i) => {
          value = value.replace(
            new RegExp(randomId + "-link-" + i + "-", "g"),
            link
          );
        });
        users.forEach((user, i) => {
          value = value.replace(
            new RegExp(randomId + "-user-" + i + "-", "g"),
            `<a href="https://steemit.com/${user}">@${user}</a>`
          );
        });

        this.setState({ value });
      });
  }

  render() {
    return (
      <div className="article">
        <div dangerouslySetInnerHTML={{ __html: this.state.value }} />
      </div>
    );
  }
}

export default Renderer;
