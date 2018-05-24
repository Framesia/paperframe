import axios from "axios";

const URL = "https://api.steemit.com/";
let id = 0;

const fetchSteemit = ({ type, data }) => {
  id++;

  return new Promise((resolve, reject) => {
    axios
      .post(URL, {
        id,
        jsonrpc: "2.0",
        method: "call",
        params: ["database_api", type, data]
      })
      .then(res => {
        resolve(res.data.result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const api = {
  getPosts({ sortBy, query }) {
    return fetchSteemit({
      type: `get_discussions_by_${sortBy}`,
      data: [query]
    });
  },
  getContent({ author, permlink }) {
    return fetchSteemit({
      type: "get_content",
      data: [author, permlink]
    });
  },
  getUser({ username }) {
    return fetchSteemit({
      type: "get_accounts",
      data: [[username]]
    });
  },
  getComments({ category, author, permlink }) {
    return fetchSteemit({
      type: "get_state",
      data: [`/${category}/@${author}/${permlink}`]
    });
  }
};

export default api;
