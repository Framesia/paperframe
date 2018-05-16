import steemApi from "../../src/helpers/steemApi";
import { getTagDefinition } from "../../src/helpers/duckDuckGoApi";

const initState = {
  auth: {
    isLogin: false,
    loginURL: "",
    me: {},
    loading: null
  },
  users: {
    entities: {},
    loading: {}
  },
  posts: {
    ids: {},
    entities: {},
    loading: {}
  },
  tags: {
    loading: {},
    definitions: {}
  }
};

const fetch = ({ type }) => {
  return (req, res, next) => {
    if (type === "tag") {
      const { tag } = req.params;
      getTagDefinition(tag)
        .then(result => {
          const STATE = {
            ...initState,
            tags: {
              loading: false,
              definitions: {
                [tag]: result.data
              }
            }
          };
          req.state = STATE;
          global.STATE = STATE;
          next();
        })
        .catch(e => next(e));
    } else {
      req.state = initState;
      next();
    }
  };
};

module.exports = fetch;
