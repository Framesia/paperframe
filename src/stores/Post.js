import { store } from "react-easy-state";

import { Client } from "dsteem";

const client = new Client("https://api.steemit.com");

const PostStore = store({
  posts: {},
  entities: {},

  getPost({ sortBy, query }) {
    if (!PostStore.posts[sortBy]) {
      PostStore.posts[sortBy] = {};
    }
    if (!PostStore.posts[sortBy][query.tag]) {
      PostStore.posts[sortBy][query.tag] = {};
    }
    client.database.getDiscussions(sortBy, query).then(discussions => {
      discussions.forEach(post => {
        try {
          post.json_metadata = JSON.parse(post.json_metadata);
        } catch (e) {}
        const id = `${post.author}/${post.permlink}`;
        PostStore.posts[sortBy][query.tag][id] = true;
        PostStore.entities[id] = post;
      });
    });
  },

  selectPosts({ sortBy, tag }) {
    if (PostStore.posts[sortBy] && PostStore.posts[sortBy][tag]) {
      return Object.keys(PostStore.posts[sortBy][tag]).map(
        id => PostStore.entities[id]
      );
    } else {
      return [];
    }
  }
});

export default PostStore;
