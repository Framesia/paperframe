import Cookies from "js-cookie";
import { store } from "react-easy-state";

import steemconnect from "../helpers/steemconnect";

const AuthStore = store({
  isLogin: false,
  loginURL: "",
  me: {},
  loading: false,

  getLoginURL() {
    AuthStore.loginURL = steemconnect().getLoginURL();
  },
  getMe() {
    AuthStore.loading = true;
    steemconnect().me((err, res) => {
      if (err) {
      } else {
        AuthStore.me = res;
        AuthStore.isLogin = true;
      }
      AuthStore.loading = false;
    });
  },
  getAccessToken() {
    return Cookies.get("accessToken");
  }
});

export default AuthStore;
