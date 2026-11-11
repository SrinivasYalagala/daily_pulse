import mongoose from "mongoose";

const updateModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        // Screen 04: Post daily update fields
        doneYesterday: {
            type: String,
            trim: true,
            default: "",
        },
        plannedToday: {
            type: String,
            trim: true,
            default: "",
        },
        blocked: {
            type: String,
            trim: true,
            default: "",
        },
        oneNumber: {
            label: {
                type: String,
                trim: true,
                default: "",
            },
            value: {
                type: Number,
                default: null,
            },
        },
        status: {
            type: String,
            enum: ["Updated", "Late", "Missing", "Pending", "In Progress", "Completed", "Blocked"],
            default: "Updated",
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

updateModel.index({ userId: 1, date: -1 });
updateModel.index({ date: 1 });
updateModel.index({ status: 1 });

const UpdateModels = mongoose.model("Updates", updateModel);

export default UpdateModels;
