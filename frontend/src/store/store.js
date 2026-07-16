import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import playlistReducer from "../features/playlists/playlistSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    playlist: playlistReducer,
  },
});

export default store;
