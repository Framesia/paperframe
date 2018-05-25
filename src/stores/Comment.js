import { store } from "react-easy-state";

import axios from "axios";

import steemconnect from "../helpers/steemconnect";
import steemApi from "../helpers/steemApi";
import AuthStore from "./Auth";
import root from "window-or-global";

const CommentStore = store({
  tree: {},

  entities: {},

  loading: {},

  getComments({ category, author, permlink }) {
    const postId = `${author}/${permlink}`;
    if (!CommentStore.tree[postId]) {
      CommentStore.tree[postId] = [];
    }
    CommentStore.loading[postId] = true;
    steemApi.getComments({ category, author, permlink }).then(data => {
      const comments = data.content;
      const users = data.account;

      let allImageInComments = {};

      Object.keys(comments).forEach(commentId => {
        const comment = comments[commentId];
        try {
          comment.json_metadata = JSON.parse(comment.json_metadata);
        } catch (e) {}

        if (commentId !== postId) {
          // get all images
          const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))(\?[-a-zA-Z0-9=&]+)?/gi;
          allImageInComments[commentId] = [];

          comment.body.replace(imageRegex, img => {
            allImageInComments[commentId].push(img);
            // comment.imageSizes = [...img];
          });

          const parentId = `${comment.parent_author}/${comment.parent_permlink}`;

          if (AuthStore.isLogin) {
            comment.active_votes.forEach(vote => {
              if (vote.voter === AuthStore.me.user && vote.percent > 0) {
                comment.isVoted = true;
              }
            });
          }

          if (!CommentStore.tree[parentId]) {
            CommentStore.tree[parentId] = [];
          }
          CommentStore.tree[parentId].push(commentId);
          CommentStore.entities[commentId] = comment;
        }
      });

      // flatten
      let image = [];
      Object.keys(allImageInComments).forEach(id => {
        const imgs = allImageInComments[id];
        imgs.forEach(img => image.push(img));
      });
      if (image.length) {
        axios
          .get("https://image-size-api.glitch.me/", {
            params: {
              image
            }
          })
          .then(({ data }) => {
            if (data.result) {
              data.result.forEach(res => {
                Object.keys(allImageInComments).forEach(id => {
                  // CommentStore.data[id].imageSizes = [];
                  const imgs = allImageInComments[id];
                  imgs.forEach(img => {
                    if (res.img === img) {
                      if (!CommentStore.entities[id].imageSizes) {
                        CommentStore.entities[id].imageSizes = [];
                      }
                      CommentStore.entities[id].imageSizes.push(res);
                      CommentStore.loading[postId] = false;
                    }
                  });
                });
              });
            }
          })
          .catch(e => {
            CommentStore.loading[postId] = false;
          });
      } else {
        CommentStore.loading[postId] = false;
      }
    });
  },

  votePost({ author, permlink, weight = 10000 }) {
    const api = steemconnect();
    const voter = AuthStore.me.user;
    if (AuthStore.isLogin) {
      const id = `${author}/${permlink}`;
      CommentStore.entities[id].voteLoading = true;
      if (weight > 0) {
        CommentStore.entities[id].isVoted = true;
        CommentStore.entities[id].net_votes++;
      } else {
        CommentStore.entities[id].isVoted = false;
        CommentStore.entities[id].net_votes--;
      }
      api.vote(voter, author, permlink, weight, (err, res) => {
        if (!err) {
          CommentStore.entities[id].voteLoading = false;
        }
      });
    }
  },

  selectComments({ author, permlink, sortBy }) {
    const postId = `${author}/${permlink}`;

    const tree = CommentStore.tree[postId] || [];
    return tree.map(id => CommentStore.entities[id]);
  },
  selectLoading({ author, permlink }) {
    const postId = `${author}/${permlink}`;
    return CommentStore.loading[postId];
  }
});

root.CommentStore = CommentStore;

export default CommentStore;
