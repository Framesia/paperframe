import Cookies from "js-cookie";
import { store } from "react-easy-state";

import steemconnect from "../helpers/steemconnect";

const AuthStore = store({
  tags: ["science", "future"]
});

export default AuthStore;
