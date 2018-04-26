import axios from "axios";

const URL = "https://api.steemit.com/";
let id = 0;

const fetchSteemit = ({ type, data }) => {
  id++;

  return axios.post(URL, {
    id,
    jsonrpc: "2.0",
    method: "call",
    params: ["database_api", type, data]
  });
};

const api = {
  getPosts({ sortBy, query }) {
    return new Promise((resolve, reject) => {
      fetchSteemit({
        type: `get_discussions_by_${sortBy}`,
        data: [query]
      })
        .then(res => {
          resolve(res.data.result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

export default api;
