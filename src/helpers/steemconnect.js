import sc2 from "sc2-sdk";
import Cookies from "js-cookie";

import querystring from "querystring";

let data = {
  app: "framesia.app",
  callbackURL: window.location.origin,
  scope: ["vote", "comment", "delete_comment", "comment_options", "custom_json"]
};

const steemconnect = () => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    data.accessToken = accessToken;
  } else {
    const parsed = querystring.parse(window.location.search);
    if (parsed) {
      const { username } = parsed;
      const access_token = parsed["?access_token"];
      if (access_token) {
        Cookies.set("accessToken", access_token, { expires: 7 });
        Cookies.set("username", username, { expires: 7 });
        data.accessToken = accessToken;
      }
    }
  }
  return sc2.Initialize(data);
};

export default steemconnect;
