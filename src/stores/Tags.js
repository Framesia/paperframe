import { store } from "react-easy-state";

import AuthStore from "./Auth";
const TagStore = store({
  loading: {
    // tag: false
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
  }
});
window.TagStore = TagStore;
export default TagStore;
