import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
    const [fullName, username, email, password] = req.body;

    if (
        [fullName, username, email, password].some(
            (field) => field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All Fields are Required !!!");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists.");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required.");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);
    

    if (!avatar) {
        throw new ApiError(400, "Avatar is required.");
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }
    
    
    return res.status(201).json(
        new ApiResponse(200, "User Registered Successfully.", createdUser)
    );
});

export { registerUser };
