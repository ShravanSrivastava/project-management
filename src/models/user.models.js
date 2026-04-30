import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        avatar: {
            type:{
                url: String,
                localPath: String,
            },
            default: {
                url: ``,
                localPath: "",
            }
        },
        userName: {
            type: String,
            required:true,
            lowercase: true,
            trim:true,
            index:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullName:{
            type:String,
            trim:true
        },
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String
        },
        forgetPasswordToken:{
            type:String
        },
        forgotPasswordExpiry:{
            type:Date
        }
    },
    {
        timeStamps:true,
    }
)


export const user = mongoose.model("user",userSchema)