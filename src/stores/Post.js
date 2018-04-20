import { store } from "react-easy-state";

import { Client } from "dsteem";

const client = new Client("https://api.steemit.com");

const PostStore = store({
  trending: {},
  getTrending() {
    client.database
      .getDiscussions("trending", { tag: "writing", limit: 1 })
      .then(discussions => {
        console.log(discussions);
      });
  }
});

export default PostStore;
