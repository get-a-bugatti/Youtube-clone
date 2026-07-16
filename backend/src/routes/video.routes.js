import { Router } from "express";
import {
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getMyVideos,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/all").get(getAllVideos);
router.route("/:videoId").get(verifyJWT, getVideoById);
//  get /video/publish should have a form
router.route("/publish").post(
  verifyJWT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "videoFile",
      maxCount: 1,
    },
  ]),
  publishVideo
);
router.route("/me").post(verifyJWT, getMyVideos);
router.route("/:videoId/update").post(verifyJWT, updateVideo);
router.route("/:videoId/delete").post(verifyJWT, deleteVideo);
router.route("/:videoId/toggle-publish").post(verifyJWT, togglePublishStatus);
router.route("/:videoId/comments").get(getVideoComments);

export default router;
