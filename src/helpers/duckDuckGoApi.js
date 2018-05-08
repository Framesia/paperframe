import axios from "axios";

const URL = "https://api.duckduckgo.com/";

export const getTagDefinition = tag => {
  return axios.get(URL, {
    params: {
      q: tag,
      format: "json",
      pretty: 1,
      skip_disambig: 1
    }
  });
};
