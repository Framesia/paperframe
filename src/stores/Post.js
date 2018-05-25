import { store } from "react-easy-state";

import axios from "axios";

import steemconnect from "../helpers/steemconnect";
import steemApi from "../helpers/steemApi";
import AuthStore from "./Auth";
import root from "window-or-global";

import arslugify from "arslugify";

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

  create: {
    error: false,
    loading: false,
    success: false,
    data: {}
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
    steemApi
      .getContent({ author, permlink })
      .then(post => {
        if (post.id === 0) {
          PostStore.loading[id] = false;
          PostStore.entities[id] = post;
          return;
        }
        try {
          post.json_metadata = JSON.parse(post.json_metadata);
        } catch (e) {}

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
        // at html render too
        // get all images
        const image = Array.isArray(post.json_metadata.image)
          ? post.json_metadata.image
          : [];
        const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))(\?[-a-zA-Z0-9=&]+)?/gi;
        post.body.replace(imageRegex, img => {
          if (!image.some(imgI => imgI === img)) {
            image.push(img);
          }
        });
        if (image.length) {
          axios
            .get("https://frms-image-size.herokuapp.com/", {
              params: {
                image
              }
            })
            .then(({ data }) => {
              PostStore.loading[id] = false;
              post.imageSizes = data.result;
              PostStore.entities[id] = { ...PostStore.entities[id], ...post };
            })
            .catch(err => {
              PostStore.loading[id] = false;
              PostStore.entities[id] = { ...PostStore.entities[id], ...post };
            });
        } else {
          PostStore.loading[id] = false;
          PostStore.entities[id] = { ...PostStore.entities[id], ...post };
        }
      })
      .catch(err => {
        PostStore.loading[id] = false;
        return;
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
        PostStore.entities[id].net_votes++;
      } else {
        PostStore.entities[id].isVoted = false;
        PostStore.entities[id].net_votes--;
      }
      api.vote(voter, author, permlink, weight, (err, res) => {
        if (!err) {
          PostStore.entities[id].voteLoading = false;
        }
      });
    }
  },

  createPost({ title, body, tags }) {
    const api = steemconnect();
    const author = AuthStore.me.name;
    const operations = [];

    const permlink = arslugify(title);
    tags = tags.map(tag => arslugify(tag));
    const category = tags[0];
    // extract images from img src
    let image = body.match(/<img[^>]+src="([^">]+)"/g);
    if (image && image.length) {
      image = image.map(img => img.replace(/<img[^>]+src="([^">]+)"/, "$1"));
    }
    // extract links from a href
    let links = body.match(/<a[^>]+href="([^">]+)"/g);
    if (links && links.length) {
      links = links.map(link => link.replace(/<a[^>]+href="([^">]+)"/, "$1"));
    }

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
          links,
          image,
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

    PostStore.create.loading = true;
    PostStore.create.data = {};
    PostStore.create.error = false;
    PostStore.create.success = false;
    // setTimeout(() => {
    //   PostStore.create.loading = false;
    // }, 5000);
    api.broadcast(operations, (err, res) => {
      console.log(err, res);
      if (err) {
        PostStore.create.error = true;
        PostStore.create.loading = false;
      } else {
        PostStore.create.data = res;
        PostStore.create.loading = false;
        PostStore.create.success = true;
        root.localStorage.removeItem("article-draft-title");
        root.localStorage.removeItem("article-draft-body");
        root.localStorage.removeItem("article-draft-tags");
      }
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

root.PostStore = PostStore;
export default PostStore;
