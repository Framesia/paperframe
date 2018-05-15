import { store } from "react-easy-state";

import AuthStore from "./Auth";
import PostStore from "./Post";
import root from "window-or-global";

import { getTagDefinition } from "../helpers/duckDuckGoApi";
const TagStore = store({
  loading: {
    // tag: false
  },
  definitions: {
    // tag: {}
  },

  followTag(tag) {
    const prevMetadata = AuthStore.me.user_metadata;
    if (!Array.isArray(prevMetadata.follow_tags)) {
      prevMetadata.follow_tags = [tag];
      AuthStore.updateMetadata(prevMetadata);
    } else {
      let tagFound = false;
      prevMetadata.follow_tags.forEach(prevTag => {
        if (prevTag === tag) {
          tagFound = true;
          return;
        }
      });
      if (!tagFound) {
        const newMetadata = {
          ...prevMetadata,
          follow_tags: [tag, ...prevMetadata.follow_tags]
        };
        TagStore.loading[tag] = true;
        AuthStore.updateMetadata(newMetadata, () => {
          TagStore.loading[tag] = false;
        });
      }
    }
  },
  unfollowTag(tag) {
    if (
      AuthStore.me.user_metadata &&
      Array.isArray(AuthStore.me.user_metadata.follow_tags)
    ) {
      const prevMetadata = AuthStore.me.user_metadata;
      const newFollow = prevMetadata.follow_tags.filter(
        prevTag => prevTag !== tag
      );
      const newMetadata = {
        ...prevMetadata,
        follow_tags: newFollow
      };
      TagStore.loading[tag] = true;
      AuthStore.updateMetadata(newMetadata, () => {
        TagStore.loading[tag] = false;
      });
    }
  },
  getDefinition(tag) {
    if (!TagStore.definitions[tag]) {
      getTagDefinition(tag).then(result => {
        TagStore.definitions[tag] = result.data;
      });
    }
  },

  selectFollowedTags() {
    if (
      AuthStore.me.user_metadata &&
      Array.isArray(AuthStore.me.user_metadata.follow_tags)
    ) {
      return AuthStore.me.user_metadata.follow_tags;
    } else {
      return [];
    }
  },
  selectLoading(tag) {
    return TagStore.loading[tag];
  },
  selectDefinition(tag) {
    return TagStore.definitions[tag];
  },
  selectRelatedTags(tag) {
    const result = {};
    Object.keys(PostStore.entities).forEach(postId => {
      const post = PostStore.entities[postId];
      const tags = post.json_metadata.tags;
      let hasTag = false;
      tags.forEach(tagMeta => {
        if (tagMeta === tag) {
          hasTag = true;
        }
      });
      tags.forEach(tagMeta => {
        if (hasTag && tagMeta !== tag) {
          if (!result[tagMeta]) {
            result[tagMeta] = 1;
          } else {
            result[tagMeta] = result[tagMeta] + 1;
          }
        }
      });
    });

    return Object.keys(result)
      .sort((a, b) => {
        return result[b] - result[a];
      })
      .map(item => ({
        [item]: result[item]
      }));
  }
});
root.TagStore = TagStore;
export default TagStore;
