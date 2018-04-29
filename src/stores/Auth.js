import Cookies from "js-cookie";
import { store } from "react-easy-state";

import steemconnect from "../helpers/steemconnect";

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
        } catch (e) {
          console.log(e);
        }
        AuthStore.isLogin = true;
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
  followTag(tag) {
    const prevMetadata = AuthStore.me.user_metadata;
    if (!Array.isArray(prevMetadata.follow_tags)) {
      prevMetadata.follow_tags = [tag];
      AuthStore.updateMetadata(prevMetadata);
    } else {
      let tagFound = false;
      prevMetadata.follow_tags.forEach(prevTag => {
        if (prevTag === tag) {
          tagFound = true;
          return;
        }
      });
      if (!tagFound) {
        const newMetadata = {
          ...prevMetadata,
          follow_tags: [tag, ...prevMetadata.follow_tags]
        };
        AuthStore.updateMetadata(newMetadata);
      }
    }
  },
  unfollowTag(tag) {
    if (
      AuthStore.me.user_metadata &&
      Array.isArray(AuthStore.me.user_metadata.follow_tags)
    ) {
      const prevMetadata = AuthStore.me.user_metadata;
      const newFollow = prevMetadata.follow_tags.filter(
        prevTag => prevTag !== tag
      );
      const newMetadata = {
        ...prevMetadata,
        follow_tags: newFollow
      };
      AuthStore.updateMetadata(newMetadata);
    }
  },
  updateMetadata(metadata) {
    steemconnect().updateUserMetadata(metadata, (err, res) => {
      console.log(err, res);
      AuthStore.me.user_metadata = res.user_metadata;
    });
  }
});

window.AuthStore = AuthStore;

export default AuthStore;
