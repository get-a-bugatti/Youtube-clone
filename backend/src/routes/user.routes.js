import { Router } from "express";
import {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,

  // Current User
  getCurrentUser,
  updateAccountDetails,
  updatePassword,
  updateAvatar,
  updateCoverImage,
  getWatchHistory,
  getMySubscriptions,

  // Channels
  getChannel,
  getChannelVideos,
  getChannelSubscribers,
  getChannelSubscriberCount,
  getChannelSubscriptionCount,
} from "../controllers/user.controller.js";

import {
  checkSubscription,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/* ---------- Auth ---------- */

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", upload.none(), loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", upload.none(), refreshAccessToken);

/* ---------- Current User ---------- */

router.get("/me", verifyJWT, getCurrentUser);

router.patch("/me", verifyJWT, updateAccountDetails);

router.patch("/me/password", verifyJWT, updatePassword);

router.patch("/me/avatar", verifyJWT, upload.single("avatar"), updateAvatar);

router.patch(
  "/me/cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateCoverImage
);

router.get("/me/watch-history", verifyJWT, getWatchHistory);

router.get("/me/subscriptions", verifyJWT, getMySubscriptions);

/* ---------- Channels ---------- */

router.get("/channels/:username", getChannel);

router.get("/channels/:username/videos", getChannelVideos);

router.get("/channels/:username/subscribers", verifyJWT, getChannelSubscribers);

router.get("/channels/:username/subscribers/count", getChannelSubscriberCount);

router.get(
  "/channels/:username/subscriptions/count",
  getChannelSubscriptionCount
);

router.get("/channels/:username/subscription", verifyJWT, checkSubscription);

router.post("/channels/:username/subscription", verifyJWT, toggleSubscription);

export default router;
