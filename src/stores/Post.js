import { store } from "react-easy-state";

// import { Client } from "dsteem";
import steemconnect from "../helpers/steemconnect";
import steemApi from "../helpers/steemApi";
import AuthStore from "./Auth";

// const client = new Client("https://api.steemit.com");

const PostStore = store({
  ids: {
    // trending: { tag: { author/permlink: true }}
  },
  entities: {
    // author/permlink: { ...data }
  },
  loading: {
    // trending: { tag: false }
    // author/permlink: false
  },

  getPosts({ sortBy, query }) {
    if (!PostStore.ids[sortBy]) {
      PostStore.ids[sortBy] = {};
      PostStore.loading[sortBy] = {};
    }
    if (!PostStore.ids[sortBy][query.tag]) {
      PostStore.ids[sortBy][query.tag] = {};
      PostStore.loading[sortBy][query.tag] = false;
    }
    PostStore.loading[sortBy][query.tag] = true;
    steemApi.getPosts({ sortBy, query }).then(posts => {
      posts.forEach(post => {
        try {
          post.json_metadata = JSON.parse(post.json_metadata);
        } catch (e) {}
        const id = `${post.author}/${post.permlink}`;
        PostStore.ids[sortBy][query.tag][id] = true;

        post.isVoted = false;
        post.voteLoading = false;
        if (AuthStore.isLogin) {
          post.active_votes.forEach(vote => {
            if (vote.voter === AuthStore.me.user && vote.percent > 0) {
              post.isVoted = true;
            }
          });
        }

        PostStore.entities[id] = post;
      });
      PostStore.loading[sortBy][query.tag] = false;
    });
  },

  getContent({ author, permlink }) {
    const id = `${author}/${permlink}`;
    if (!PostStore.entities[id]) {
      PostStore.entities[id] = {};
    }
    steemApi.getContent({ author, permlink }).then(post => {
      try {
        post.json_metadata = JSON.parse(post.json_metadata);
      } catch (e) {}
      PostStore.entities[id] = {
        ...PostStore.entities[id],
        ...post
      };
    });
  },

  votePost({ author, permlink, weight = 10000 }) {
    const api = steemconnect();
    const voter = AuthStore.me.user;
    if (AuthStore.isLogin) {
      const id = `${author}/${permlink}`;
      PostStore.entities[id].voteLoading = true;
      api.vote(voter, author, permlink, weight, (err, res) => {
        if (!err) {
          PostStore.entities[id].voteLoading = false;
          if (weight > 0) {
            PostStore.entities[id].isVoted = true;
          } else {
            PostStore.entities[id].isVoted = false;
          }
        }
      });
    }
  },

  selectPosts({ sortBy, tag }) {
    if (PostStore.ids[sortBy] && PostStore.ids[sortBy][tag]) {
      const { ids, entities } = PostStore;
      const posts = Object.keys(ids[sortBy][tag]).map(id => entities[id]);
      return posts;
    } else {
      return [];
    }
  },
  selectLoading({ sortBy, tag, author, permlink }) {
    if (author && permlink) {
      return PostStore.loading[`${author}/${permlink}`];
    } else if (sortBy && tag) {
      if (PostStore.loading[sortBy]) {
        return PostStore.loading[sortBy][tag];
      } else {
        return false;
      }
    }
  },
  selectPostById(id) {
    if (PostStore.entities[id]) {
      return PostStore.entities[id];
    } else {
      return {};
    }
  }
});

export default PostStore;
