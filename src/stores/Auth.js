import Cookies from "js-cookie";
import { store } from "react-easy-state";

import steemconnect from "../helpers/steemconnect";

import PostStore from "./Post";

const AuthStore = store({
  isLogin: false,
  loginURL: "",
  me: {},
  loading: null,

  getLoginURL() {
    AuthStore.loginURL = steemconnect().getLoginURL();
  },
  getMe() {
    AuthStore.loading = true;
    steemconnect().me((err, res) => {
      if (err) {
      } else {
        AuthStore.me = res;
        try {
          AuthStore.me.account.json_metadata = JSON.parse(
            res.account.json_metadata
          );
        } catch (e) {}
        AuthStore.isLogin = true;

        // voted and bookmarked
        Object.keys(PostStore.entities).map(id => {
          const post = PostStore.entities[id];
          post.isVoted = false;
          post.active_votes.forEach(vote => {
            if (vote.voter === AuthStore.me.user && vote.percent > 0) {
              post.isVoted = true;
            }
          });
          post.isBookmarked = false;
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
          return post;
        });
      }
      AuthStore.loading = false;
    });
  },
  getAccessToken() {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      AuthStore.loading = false;
    }
    return accessToken;
  },
  doLogout() {
    Cookies.remove("accessToken");
    AuthStore.me = {};
    AuthStore.isLogin = false;
  },

  updateMetadata(metadata, callback) {
    steemconnect().updateUserMetadata(metadata, (err, res) => {
      AuthStore.me.user_metadata = res.user_metadata;
      callback();
    });
  }
});

window.AuthStore = AuthStore;
export default AuthStore;
