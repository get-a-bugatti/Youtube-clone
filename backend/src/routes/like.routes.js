import {
  toggleLikeComment,
  toggleLikeTweet,
  toggleLikeVideo,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/videos").get(verifyJWT, getLikedVideos);
router.route("/videos").post(verifyJWT, toggleLikeVideo);

export default router;
