import {User} from "../models/user.model.js";
import {ApiError} from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {asynHandler} from "../utils/asyncHandler.js";

const registerUser = (async (req,res) => {
    const {email,username,password,role} = req.body;

    const existedUser = await User.findOne({
        $or: [{email},{username}]
    })

    if(existedUser){
        throw new ApiError(409, "user with this email or username already exists")
    }

    User.create({
        email,
        username,
        password,
        isEmailVerified: false
    })

    const { unHashed, hashed, tokenExpiry } = user.generateTemporaryToken();
})