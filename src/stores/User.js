import { store } from "react-easy-state";

import AuthStore from "./Auth";
import steemApi from "../helpers/steemApi";

const UserStore = store({
  entities: {},
  loading: {},
  getUser({ username }) {
    const id = username;
    if (!UserStore.entities[id]) {
      UserStore.entities[id] = {};
    }
    UserStore.loading[id] = true;
    steemApi
      .getUser({ username })
      .then(result => {
        UserStore.loading[id] = false;
        const userData = result[0];
        try {
          userData.json_metadata = JSON.parse(userData.json_metadata);
        } catch (e) {}
        UserStore.entities[id] = userData;
      })
      .catch(err => {
        UserStore.loading[id] = false;
      });
  },

  selectUser({ username }) {
    const id = username;
    return UserStore.entities[id];
  },
  selectLoading({ username }) {
    const id = username;
    return UserStore.loading[id];
  }
});

window.UserStore = UserStore;

export default UserStore;
