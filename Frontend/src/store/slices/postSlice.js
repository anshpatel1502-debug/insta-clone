import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFeed, createPost, likePost, unLikePost } from "../../features/posts/services/post.api";
import {
  followUser,
  unFollowUser,
  acceptFollowRequest,
  rejectFollowRequest,
  getPendingFollowRequests
} from "../../features/posts/services/follow.api";

export const fetchFeed = createAsyncThunk(
  "posts/fetchFeed",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeed();
      return data.posts.reverse();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch feed");
    }
  }
);

export const createPostThunk = createAsyncThunk(
  "posts/createPost",
  async ({ imgURL, caption }, { rejectWithValue }) => {
    try {
      const data = await createPost(imgURL, caption);
      return data.post;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create post");
    }
  }
);

export const likePostThunk = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await likePost(postId);
      return { postId, like: data.like };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to like post");
    }
  }
);

export const unLikePostThunk = createAsyncThunk(
  "posts/unLikePost",
  async (postId, { rejectWithValue }) => {
    try {
      await unLikePost(postId);
      return { postId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to unlike post");
    }
  }
);

export const followUserThunk = createAsyncThunk(
  "posts/followUser",
  async (username, { rejectWithValue }) => {
    try {
      const response = await followUser(username);
      return { username, follow: response.follow };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to follow user");
    }
  }
);

export const unFollowUserThunk = createAsyncThunk(
  "posts/unFollowUser",
  async (username, { rejectWithValue }) => {
    try {
      await unFollowUser(username);
      return { username };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to unfollow user");
    }
  }
);

export const fetchPendingRequestsThunk = createAsyncThunk(
  "posts/fetchPendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPendingFollowRequests();
      return data.requests || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch pending requests");
    }
  }
);

export const acceptRequestThunk = createAsyncThunk(
  "posts/acceptRequest",
  async (username, { dispatch, rejectWithValue }) => {
    try {
      await acceptFollowRequest(username);
      dispatch(fetchFeed());
      dispatch(fetchPendingRequestsThunk());
      return username;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to accept request");
    }
  }
);

export const rejectRequestThunk = createAsyncThunk(
  "posts/rejectRequest",
  async (username, { dispatch, rejectWithValue }) => {
    try {
      await rejectFollowRequest(username);
      dispatch(fetchFeed());
      dispatch(fetchPendingRequestsThunk());
      return username;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to reject request");
    }
  }
);

const initialState = {
  feed: null,
  loading: false,
  error: null,
  pendingRequests: [],
  loadingRequests: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Simple state modifiers if any
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feed
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPostThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.feed) {
          state.feed.unshift(action.payload);
        } else {
          state.feed = [action.payload];
        }
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like Post (Optimistic)
      .addCase(likePostThunk.pending, (state, action) => {
        const postId = action.meta.arg;
        if (state.feed) {
          state.feed = state.feed.map(p => p._id === postId ? { ...p, isLiked: true } : p);
        }
      })
      .addCase(likePostThunk.rejected, (state, action) => {
        const postId = action.meta.arg;
        if (state.feed) {
          state.feed = state.feed.map(p => p._id === postId ? { ...p, isLiked: false } : p);
        }
      })
      // Unlike Post (Optimistic)
      .addCase(unLikePostThunk.pending, (state, action) => {
        const postId = action.meta.arg;
        if (state.feed) {
          state.feed = state.feed.map(p => p._id === postId ? { ...p, isLiked: false } : p);
        }
      })
      .addCase(unLikePostThunk.rejected, (state, action) => {
        const postId = action.meta.arg;
        if (state.feed) {
          state.feed = state.feed.map(p => p._id === postId ? { ...p, isLiked: true } : p);
        }
      })
      // Follow User (Optimistic)
      .addCase(followUserThunk.pending, (state, action) => {
        const username = action.meta.arg;
        if (state.feed) {
          state.feed = state.feed.map(post => {
            if (post.user && post.user.username === username) {
              return {
                ...post,
                user: {
                  ...post.user,
                  followStatus: "pending",
                  isFollowed: false
                }
              };
            }
            return post;
          });
        }
      })
      // Unfollow User (Optimistic)
      .addCase(unFollowUserThunk.pending, (state, action) => {
        const username = action.meta.arg;
        if (state.feed) {
          state.feed = state.feed.map(post => {
            if (post.user && post.user.username === username) {
              return {
                ...post,
                user: {
                  ...post.user,
                  followStatus: "none",
                  isFollowed: false
                }
              };
            }
            return post;
          });
        }
      })
      // Fetch Pending Requests
      .addCase(fetchPendingRequestsThunk.pending, (state) => {
        state.loadingRequests = true;
      })
      .addCase(fetchPendingRequestsThunk.fulfilled, (state, action) => {
        state.loadingRequests = false;
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingRequestsThunk.rejected, (state) => {
        state.loadingRequests = false;
      })
      // Accept Request (Optimistic filter)
      .addCase(acceptRequestThunk.pending, (state, action) => {
        const username = action.meta.arg;
        state.pendingRequests = state.pendingRequests.filter(req => req.follower?.username !== username);
      })
      // Reject Request (Optimistic filter)
      .addCase(rejectRequestThunk.pending, (state, action) => {
        const username = action.meta.arg;
        state.pendingRequests = state.pendingRequests.filter(req => req.follower?.username !== username);
      });
  }
});

export default postSlice.reducer;
