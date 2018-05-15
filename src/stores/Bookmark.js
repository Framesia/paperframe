import { store } from "react-easy-state";

import AuthStore from "./Auth";
import PostStore from "./Post";
import root from "window-or-global";

const BookmarkStore = store({
  // loading: {
  // author/permlink: false
  // },
  bookmark({ author, permlink }) {
    const prevMetadata = AuthStore.me.user_metadata;
    const id = `${author}/${permlink}`;
    if (!Array.isArray(prevMetadata.bookmarks)) {
      prevMetadata.bookmarks = [id];
      AuthStore.updateMetadata(prevMetadata);
    } else {
      let bookmarkFound = false;
      prevMetadata.bookmarks.forEach(bookmark => {
        if (bookmark === id) {
          bookmarkFound = true;
          return;
        }
      });
      if (!bookmarkFound) {
        const newMetadata = {
          ...prevMetadata,
          bookmarks: [id, ...prevMetadata.bookmarks]
        };
        PostStore.entities[id].bookmarkLoading = true;
        PostStore.entities[id].isBookmarked = true;
        AuthStore.updateMetadata(newMetadata, () => {
          PostStore.entities[id].bookmarkLoading = false;
        });
      }
    }
  },
  unBookmark({ author, permlink }) {
    const id = `${author}/${permlink}`;
    if (!PostStore.entities[id]) {
      PostStore.entities[id] = {};
    }
    if (
      AuthStore.me.user_metadata &&
      Array.isArray(AuthStore.me.user_metadata.bookmarks)
    ) {
      const prevMetadata = AuthStore.me.user_metadata;
      const newBookmarks = prevMetadata.bookmarks.filter(
        bookmark => bookmark !== id
      );
      const newMetadata = {
        ...prevMetadata,
        bookmarks: newBookmarks
      };
      PostStore.entities[id].bookmarkLoading = true;
      PostStore.entities[id].isBookmarked = false;
      AuthStore.updateMetadata(newMetadata, () => {
        PostStore.entities[id].bookmarkLoading = false;
      });
    }
  },
  selectBookmarks() {
    if (
      AuthStore.me.user_metadata &&
      Array.isArray(AuthStore.me.user_metadata.bookmarks)
    ) {
      return AuthStore.me.user_metadata.bookmarks;
    } else {
      return [];
    }
  }
});

export default BookmarkStore;
