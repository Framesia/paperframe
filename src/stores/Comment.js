import { store } from "react-easy-state";

import axios from "axios";

import steemconnect from "../helpers/steemconnect";
import steemApi from "../helpers/steemApi";
import AuthStore from "./Auth";
import root from "window-or-global";

const CommentStore = store({
  data: {},

  getComments({ category, author, permlink }) {
    const postId = `${author}/${permlink}`;
    if (!CommentStore.data[postId]) {
      CommentStore.data[postId] = {};
    }
    steemApi.getComments({ category, author, permlink }).then(data => {
      const comments = data.content;
      const users = data.account;
      Object.keys(comments).forEach(commentId => {
        if (commentId !== postId) {
          CommentStore.data[postId][commentId] = comments[commentId];
        }
      });
    });
  }
});

root.CommentStore = CommentStore;

export default CommentStore;
