import bcrypt from "bcrypt";
import { encrypt, decrypt } from "../Utils/EncryptDecrypt.js";
import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        roleId: { type: Number, required: true, enum: [1, 2, 3] },
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            set: encrypt,
            get: decrypt,
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true,
            set: encrypt,
            get: decrypt,
        },
        password: {
            type: String,
            required: true,
            select: false,
            validate: {
                validator: function (v) {
                    // Skip validation if already hashed
                    if (v.startsWith("$2b$")) return true;
                    const regex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return regex.test(v);
                },
                message:
                    "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number & 1 special character",
            },
        },
        dob: {
            type: Date,
            default: null
        },
        designationId: {
            type: String,
            trim: true,
            default: null
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            default: null,
        },
        imageUrl: {
            url: {
                type: String,
                default: null,
            },
            publicId: {
                type: String,
                default: null,
            },
            resourceType: {
                type: String,
                default: null,
            },
        },
        accountStatus: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        fcm: {
            type: [String],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        is2FAEnabled: {
            type: Boolean,
            default: false
        },
        totpSecret: {
            type: String,
            trim: true,
            default: null,
            set: encrypt,
            get: decrypt
        }
    },
    {
        id: false,
        timestamps: true,
        versionKey: false,
        toJSON: { getters: true },
        toObject: { getters: true },
    }
);

userModel.index({ email: 1 }, { unique: true });
userModel.index({ mobileNumber: 1 }, { unique: true });

/* ================================
   PASSWORD HASHING - SAVE
================================ */

userModel.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// userModel.pre("findOneAndUpdate", async function (next) {
//     try {
//         const update = this.getUpdate();

//         const password =
//             update.password || update.$set?.password;

//         if (!password) return next();

//         const salt = await bcrypt.genSalt(10);
//         const hashed = await bcrypt.hash(password, salt);

//         if (update.password) update.password = hashed;
//         if (update.$set?.password) update.$set.password = hashed;

//         next();
//     } catch (err) {
//         next(err);
//     }
// });



const UserModels = mongoose.model("Users", userModel);

export default UserModels;