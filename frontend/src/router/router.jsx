import App, {AppLoader} from "../App.jsx";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Signup = lazy(() => import("../pages/Signup.jsx"));

const PlayVideo = lazy(() => import("../pages/PlayVideo.jsx"));
const Channel = lazy(() => import("../pages/Channel.jsx"));

const CreateVideo = lazy(() => import("../pages/CreateVideo.jsx"));
const YourVideos = lazy(() => import("../pages/YourVideos.jsx"));
const LikedVideos = lazy(() => import("../pages/LikedVideos.jsx"));
const Subscriptions = lazy(() => import("../pages/Subscriptions.jsx"));
const WatchHistory = lazy(() => import("../pages/WatchHistory.jsx"));
const MyPlaylists = lazy(() => import("../pages/MyPlaylists.jsx"));
const PlaylistPage = lazy(() => import("../pages/PlaylistPage.jsx"));

// Error page
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

// Components
import CommentCard from "../features/comments/CommentCard.jsx";
import { Protected } from "../components/index.js";

// Loaders
import { YourVideosLoader } from "../pages/YourVideos.jsx";
import { WatchHistoryLoader } from "../pages/WatchHistory.jsx";
import { MyPlaylistsLoader } from "../pages/MyPlaylists.jsx";
import { PlaylistLoader } from "../pages/PlaylistPage.jsx";
import { SubscriptionsLoader } from "../pages/Subscriptions.jsx";
import { likedVideosLoader } from "../pages/LikedVideos.jsx";
import { playVideoLoader } from "../pages/PlayVideo.jsx";
import { ChannelLoader } from "../pages/Channel.jsx";
import { homeLoader } from "../pages/Home.jsx";


const publicRoutes = {
  element: <Protected authentication={false} />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "signup",
      element: <Signup />,
    },
    {
      path: "watch",
      loader: playVideoLoader,
      element: <PlayVideo />,
    },
    {
      path: "channel/:username",
      loader: ChannelLoader,
      element: <Channel />,
    },
    {
      path: "test-comment",
      element: <CommentCard />,
    },
  ],
};

const privateRoutes = {
  element: <Protected authentication={true} />,
  children: [
    {
      path: "create-video",
      element: <CreateVideo />,
    },
    {
      path: "your-videos",
      loader: YourVideosLoader,
      element: <YourVideos />,
    },
    {
      path: "liked-videos",
      loader: likedVideosLoader,
      element: <LikedVideos />,
    },
    {
      path: "subscriptions",
      loader: SubscriptionsLoader,
      element: <Subscriptions />,
    },
    {
      path: "watch-history",
      loader: WatchHistoryLoader,
      element: <WatchHistory />,
    },
    {
      path: "my-playlists",
      loader: MyPlaylistsLoader,
      element: <MyPlaylists />,
    },
    {
      path: "playlist/:playlistId",
      loader: PlaylistLoader,
      element: <PlaylistPage />,
    },
  ],
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: AppLoader,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <Home />,
      },
      publicRoutes,

      privateRoutes,

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);


export default router;