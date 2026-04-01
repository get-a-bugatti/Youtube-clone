import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { objectId } from "../utils/objectId.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType,
  } = req.query;

  // test for userId

  // remaining to implemente userId based search.

  const allowedSortBy = [
    "title",
    "duration",
    "views",
    "createdAt",
    "updatedAt",
  ];

  const allowedSortType = ["asc", "desc"];

  const finalSortBy = allowedSortBy.includes(sortBy) ? sortBy : "createdAt";
  const finalSortType = allowedSortType.includes(sortType) ? sortType : "asc";

  const finalQuery = query ? query : ".*";

  const aggregate = Video.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $match: {
        $or: [
          { title: { $regex: finalQuery, $options: "i" } },
          { description: { $regex: finalQuery, $options: "i" } },
          { owner: { $regex: finalQuery, $options: "i" } },
        ],
      },
    },
    {
      $sort: {
        [finalSortBy]: finalSortType === "desc" ? -1 : 1,
      },
    },
  ]);

  const videos = await Video.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Videos fetched successfully.", videos.docs));
});

const getVideoById = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId || !String(videoId).trim()) {
    throw new ApiError(400, "Video Id is required.");
  }

  const video = await Video.findById(videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Found and returned video successfully.", video)
    );
});

const getVideosByUserId = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType,
  } = req.query;

  // test for userId
  const userId = req.user?._id;

  if (!userId || !String(userId).trim()) {
    throw new ApiError(400, "User Id is empty or User not authenticated.");
  }

  const allowedSortBy = [
    "title",
    "duration",
    "views",
    "createdAt",
    "updatedAt",
  ];

  const allowedSortType = ["asc", "desc"];

  const finalSortBy = allowedSortBy.includes(sortBy) ? sortBy : "createdAt";
  const finalSortType = allowedSortType.includes(sortType) ? sortType : "asc";

  const finalQuery = query ? query : ".*";

  const aggregate = Video.aggregate([
    {
      $match: {
        owner: objectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $match: {
        $or: [
          { title: { $regex: finalQuery, $options: "i" } },
          { description: { $regex: finalQuery, $options: "i" } },
          { owner: { $regex: finalQuery, $options: "i" } },
        ],
      },
    },
    {
      $sort: {
        [finalSortBy]: finalSortType === "desc" ? -1 : 1,
      },
    },
  ]);

  const videos = await Video.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Found and returned user's videos successfully.",
        videos.docs
      )
    );
});

const getVideoWithOwner = asyncHandler(async (req, res) => {
  // FUTURE IDEA ;
  // store userId or IP, only increment views once per user
  // Debounce user views, only count as view if user watches video for 10-30 seconds.

  const { videoId } = req.params;

  // 1️⃣ Validate input
  if (!videoId || !String(videoId).trim()) {
    throw new ApiError(400, "Video Id is required.");
  }

  // 2️⃣ Increment views FIRST (atomic + ensures existence)
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(404, "Video not found");
  }

  // 3️⃣ Fetch video with owner (aggregation)
  const [video] = await Video.aggregate([
    {
      $match: {
        _id: updatedVideo._id, // safer than re-casting
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
  ]);

  // (extra safety, though already checked)
  if (!video) {
    throw new ApiError(404, "Video not found after aggregation");
  }

  // 4️⃣ Update watch history (NON-BLOCKING)
  const userId = req.user?._id;

  if (userId) {
    try {
      const response = await User.findOneAndUpdate(
        objectId(userId),
        {
          $addToSet: {
            watchHistory: objectId(videoId),
          },
        },
        {
          returnDocument: "after",
        }
      );

      console.log("response from updating history : ", response);
    } catch (err) {
      console.error("Watch history update failed:", err);
    }
  }

  // 5️⃣ Send response
  return res
    .status(200)
    .json(new ApiResponse(200, "Video fetched successfully.", video));
});

const deleteVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId || !String(videoId).trim()) {
    throw new ApiError(400, "Video Id is required.");
  }

  const result = await Video.findByIdAndDelete(videoId);

  if (!result) {
    throw new ApiError(500, "Something went wrong while deleting the video.");
  }

  res.status(200).json(new ApiResponse(200, "Video deleted successfully.", {}));
});

const publishAVideo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  console.log("title at ctrler", title);

  if (
    (!title && !String(title).trim()) ||
    (!description && !String(description).trim())
  ) {
    throw new ApiError(400, "Title and Description are required.");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required.");
  }

  if (!videoLocalPath) {
    throw new ApiError(400, "Video is required.");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const video = await uploadOnCloudinary(videoLocalPath);

  if (!thumbnail?.url || !video?.url) {
    throw new ApiError(500, "Error uploading to Cloudinary.");
  }

  const result = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title,
    description,
    owner: req.user?._id,
    duration: video?.duration || 0,
  });

  if (!result) {
    throw new ApiError(
      500,
      "Something went wrong while creating video record."
    );
  }

  return res.status(201).json(
    new ApiResponse(201, "Video published successfully.", {
      videoId: result._id,
    })
  );
});

const updateVideo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const { videoId } = req.params;

  if (
    (!title && !String(title).trim()) ||
    (!description && !String(description).trim())
  ) {
    throw new ApiError(400, "Title and Description are required.");
  }

  if (!videoId) {
    throw new ApiError(400, "Video Id is required.");
  }

  const video = await Video.findByIdAndUpdate(videoId, [
    {
      $set: {
        title,
        description,
      },
    },
    {
      new: true,
    },
  ]).select("title description isPublished");

  if (!video) {
    throw new ApiError(500, "Something went wrong updating video.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Updated Video details successfully.", video));
});

const togglePublishStatus = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required.");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    [
      {
        $set: {
          isPublished: { $not: "$isPublished" },
        },
      },
    ],
    {
      new: true,
    }
  ).select("title isPublished owner");

  if (!video) {
    throw new ApiError(500, "Something went wrong toggling publish status.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully toggled Publish Status.", video));
});

export {
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  deleteVideo,
  getVideosByUserId,
  getAllVideos,
  getVideoWithOwner,
};
