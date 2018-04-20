import { store } from "react-easy-state";

import { Client } from "dsteem";

const client = new Client("https://api.steemit.com");

const PostStore = store({
  ids: {},
  entities: {},

  getPost({ sortBy, query }) {
    if (!PostStore.ids[sortBy]) {
      PostStore.ids[sortBy] = {};
    }
    if (!PostStore.ids[sortBy][query.tag]) {
      PostStore.ids[sortBy][query.tag] = {};
    }
    client.database.getDiscussions(sortBy, query).then(discussions => {
      discussions.forEach(post => {
        try {
          post.json_metadata = JSON.parse(post.json_metadata);
        } catch (e) {}
        const id = `${post.author}/${post.permlink}`;
        PostStore.ids[sortBy][query.tag][id] = true;
        PostStore.entities[id] = post;
      });
    });
  },

  selectPosts({ sortBy, tag }) {
    if (PostStore.ids[sortBy] && PostStore.ids[sortBy][tag]) {
      const { ids, entities } = PostStore;
      const posts = Object.keys(ids[sortBy][tag]).map(id => entities[id]);
      return posts;
    } else {
      return [];
    }
  }
});

export default PostStore;
