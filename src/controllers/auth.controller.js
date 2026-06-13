import { user } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {sendEmail} from "../utils/mail.js";

const generateAccessandRefreshToken = async (userId) => {
    try {
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            throw new ApiError(404, "user not found");
        }

        const accessToken = foundUser.generateAccesToken();
        const refreshToken = foundUser.generateRefershToken();

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

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "user with this email or username already exists");
    }

    const User = await User.create({
        email,
        username,
        password,
        isEmailVerified: false,
        role,
    });

    const { unHashed, hashed, tokenExpiry } = createdUser.generateTemporaryToken();

    User.emailVerificationToken = hashed;
    User.emailVerificationTokenExpiry = tokenExpiry;
    await User.save({ validateBeforeSave: false });

    await sendEmail({
        email: User?.email,
        subject: "verify your email",
        mailgenContent: emailVerificationMailgenContent(
            User.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashed}`
        ),
    });

    const createdUser = await User.findById(User._id).select(
        "-password", "-refreshToken", "-emailVerificationToken", "-emailVerificationTokenExpiry"
    );

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the User");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            { user: createdUser },
            "user registered successfully and verification email sent on your mail"
        )
    );
});

export { registerUser };