import mongoose from "mongoose";


const blockerModel = new mongoose.Schema(
    {
        blockerTitle: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        relatedValue: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        whoMustAct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        severityLevel: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            required: true
        },
        whatNeed: {
            type: String,
            trim: true,
            required: true
        },

        status: {
            type: String,
            enum: ["Open", "Pending", "Acknowledged", "In Progress", "Completed", "Resolved", "Blocked"],
            default: "Open",
            required: true,
        },

        escalationLevel: {
            type: String,
            enum: ["L0", "L1"], // L0: Owner, L1: CEO + Chairman
            default: "L0",
        },
        isEscalated: {
            type: Boolean,
            default: false,
        },
        acknowledgedAt: {
            type: Date,
            default: null,
        },
        acknowledgedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default: null,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
        resolutionNote: {
            type: String,
            trim: true,
            default: "",
        },
        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Users",
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                    trim: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

blockerModel.index({ whoMustAct: 1, status: 1 });
blockerModel.index({ raisedBy: 1 });
blockerModel.index({ relatedTo: 1, relatedValue: 1 });
blockerModel.index({ isEscalated: 1 });

const BlockerModels = mongoose.model("Blockers", blockerModel);

export default BlockerModels;
