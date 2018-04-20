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
    return Cookies.get("accessToken");
  },
  doLogout() {
    Cookies.remove("accessToken");
    AuthStore.me = {};
    AuthStore.isLogin = false;
  }
});

export default AuthStore;
