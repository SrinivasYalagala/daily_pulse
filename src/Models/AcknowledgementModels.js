import mongoose from "mongoose";

const acknowledgementModel = new mongoose.Schema(
    {
        workId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Updates",
            required: true,
        },
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

acknowledgementModel.index({ workId: 1 });
acknowledgementModel.index({ fromUserId: 1 });
acknowledgementModel.index({ toUserId: 1 });

const AcknowledgementModels = mongoose.model("Acknowledgements", acknowledgementModel);

export default AcknowledgementModels;
