import axios from "axios";

const URL = "https://api.asksteem.com/search/";

export const searchUsers = user => {
  return axios.get(URL, {
    params: {
      q: user,
      types: "user"
    }
  });
};
