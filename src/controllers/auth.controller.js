import { user as User} from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {sendEmail} from "../utils/mail.js";
import { emailVerificationMailgenContent } from "../utils/mail.js";

const generateAccessandRefreshToken = async (userId) => {
    try {
        const foundUser = await User.findById(createdUser._id);
        if (!foundUser) {
            throw new ApiError(404, "user not found");
        }

        const accessToken = foundUser.generateAccessToken();
        const refreshToken = foundUser.generateRefreshToken();

        foundUser.refreshToken = refreshToken;
        await foundUser.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while generating access token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    console.log("Email:", email);
    console.log("Username:", username);

    const existedUser = await User.findOne({
        $or: [{ email }, { userName: username }],
    });

    console.log("Existing User:", existedUser);

    if (existedUser) {
        throw new ApiError(409, "user with this email or username already exists");
    }

    const createdUser = await User.create({
        email,
        userName: username,
        password,
        isEmailVerified: false,
        role,
    });

    const { unHashed, hashed, tokenExpiry } = createdUser.generateTemporaryToken();

    createdUser.emailVerificationToken = hashed;
    createdUser.emailVerificationTokenExpiry = tokenExpiry;
    await createdUser.save({ validateBeforeSave: false });

    await sendEmail({
      email: createdUser.email,
      subject: "verify your email",
      mailgenContent: emailVerificationMailgenContent(
        createdUser.userName,
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashed}`,
      ),
    });

    const foundUser = await User.findById(createdUser._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
    );

    if (!foundUser) {
        throw new ApiError(500, "something went wrong while registering the User");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            { user: foundUser },
            "user registered successfully and verification email sent on your mail"
        )
    );
});

export { registerUser };