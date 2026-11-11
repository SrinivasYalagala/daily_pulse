import mongoose from "mongoose";

const actionModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        primaryOwner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        backupOwner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
            required: true,
        },
        status: {
            type: String,
            enum: ["Open", "Pending", "In Progress", "In prog.", "Completed", "Done", "Blocked", "Overdue"],
            default: "Open",
            required: true,
        },
        linkedDetails: {
            type: String,
            required: true,
            trim: true, // Linked Project / Deal / Customer
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        // Screen 10: Close Action fields (mandatory closure note)
        closureNote: {
            type: String,
            trim: true,
            default: "",
        },
        closedAt: {
            type: Date,
            default: null,
        },
        closedBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true

        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

actionModel.index({ primaryOwner: 1, status: 1 });
actionModel.index({ backupOwner: 1 });
actionModel.index({ dueDate: 1 });

const ActionModel = mongoose.model("Actions", actionModel);

export default ActionModel;
