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
        post.isBookmarked = false;
        post.bookmarkLoading = false;

        if (AuthStore.isLogin) {
          post.active_votes.forEach(vote => {
            if (vote.voter === AuthStore.me.user && vote.percent > 0) {
              post.isVoted = true;
            }
          });
          if (
            AuthStore.me.user_metadata &&
            Array.isArray(AuthStore.me.user_metadata.bookmarks)
          ) {
            AuthStore.me.user_metadata.bookmarks.forEach(bookmark => {
              if (bookmark === id) {
                post.isBookmarked = true;
              }
            });
          }
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
    PostStore.loading[id] = true;
    steemApi.getContent({ author, permlink }).then(post => {
      try {
        post.json_metadata = JSON.parse(post.json_metadata);
      } catch (e) {}
      PostStore.loading[id] = false;
      if (AuthStore.isLogin) {
        post.active_votes.forEach(vote => {
          if (vote.voter === AuthStore.me.user && vote.percent > 0) {
            post.isVoted = true;
          }
        });
        if (
          AuthStore.me.user_metadata &&
          Array.isArray(AuthStore.me.user_metadata.bookmarks)
        ) {
          AuthStore.me.user_metadata.bookmarks.forEach(bookmark => {
            if (bookmark === id) {
              post.isBookmarked = true;
            }
          });
        }
      }
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
      if (weight > 0) {
        PostStore.entities[id].isVoted = true;
      } else {
        PostStore.entities[id].isVoted = false;
      }
      api.vote(voter, author, permlink, weight, (err, res) => {
        if (!err) {
          PostStore.entities[id].voteLoading = false;
        }
      });
    }
  },

  createPost({ title, body, category, tags }) {
    const api = steemconnect();
    const author = AuthStore.me.name;
    const permlink = "test-post";
    const operations = [];
    const commentOp = [
      "comment",
      {
        parent_author: "",
        parent_permlink: category,
        author,
        permlink,
        title,
        body,
        json_metadata: JSON.stringify({
          image: [],
          tags,
          format: "html",
          app: "framesia"
        })
      }
    ];
    operations.push(commentOp);
    const commentOptionsConfig = {
      author: author,
      permlink: permlink,
      max_accepted_payout: "1000000.000 SBD",
      percent_steem_dollars: 10000,
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: [
        [0, { beneficiaries: [{ account: "damaera", weight: 2500 }] }]
      ]
    };
    operations.push(["comment_options", commentOptionsConfig]);
    api.broadcast(operations, (err, res) => {
      console.log(err, res);
    });
    // api.comment(null, null, author, "test", title, body, {}, (err, res) => {
    //   console.log(err, res);
    // });
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

window.PostStore = PostStore;
export default PostStore;
