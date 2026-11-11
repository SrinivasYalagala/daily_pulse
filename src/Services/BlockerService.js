import mongoose from "mongoose";
import BlockerModels from "../Models/BlockerModels.js";

// Helper to calculate open duration and update escalation level (24h SLA)
const processEscalation = (blocker) => {
    const isClosed = blocker.status === "Resolved" || blocker.status === "Completed";
    const endTime = isClosed && blocker.resolvedAt ? new Date(blocker.resolvedAt) : new Date();
    const openForMs = endTime.getTime() - new Date(blocker.createdAt).getTime();
    const openForHours = Math.max(0, Math.round(openForMs / (1000 * 60 * 60)));

    const shouldEscalate = !isClosed && openForHours >= 24;
    const escalationLevel = shouldEscalate ? "L1" : blocker.escalationLevel || "L0";
    const isEscalated = shouldEscalate || blocker.isEscalated;

    return {
        ...blocker,
        openForHours,
        escalationLevel,
        isEscalated,
    };
};

// Screen 05: Raise blocker
const createBlockerService = async (blockerData) => {
    const payload = {
        ...blockerData,
        whatIsBlocked: blockerData.whatIsBlocked || blockerData.blockerTitle,
        status: blockerData.status || "Open",
        escalationLevel: "L0",
        isEscalated: false,
    };
    const response = await BlockerModels.create(payload);
    return response;
};

// Screen 06: Acknowledge blocker
const acknowledgeBlockerService = async ({ id, userId }) => {
    const response = await BlockerModels.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "Acknowledged",
                acknowledgedAt: new Date(),
                acknowledgedBy: userId,
            },
        },
        { returnDocument: "after", runValidators: true }
    );
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

// Screen 06: Mark resolved with resolution note
const resolveBlockerService = async ({ id, resolutionNote }) => {
    const response = await BlockerModels.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "Resolved",
                resolvedAt: new Date(),
                resolutionNote,
            },
        },
        { returnDocument: "after", runValidators: true }
    );
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

// Screen 06: Add comment to blocker
const addBlockerCommentService = async ({ id, userId, comment }) => {
    const response = await BlockerModels.findByIdAndUpdate(
        id,
        {
            $push: {
                comments: {
                    userId,
                    comment,
                    createdAt: new Date(),
                },
            },
        },
        { returnDocument: "after", runValidators: true }
    );
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

// Get all blockers with auto-escalation calculation


const getAllBlockersService = async (query = {}) => {
    try {
        const blockers = await BlockerModels.aggregate([
            {
                $match: query,
            },

            // Join Target User
            {
                $lookup: {
                    from: "users",
                    localField: "whoMustAct",
                    foreignField: "_id",
                    as: "whoMustAct",
                },
            },
            {
                $unwind: {
                    path: "$whoMustAct",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Raised By User
            {
                $lookup: {
                    from: "users",
                    localField: "raisedBy",
                    foreignField: "_id",
                    as: "raisedBy",
                },
            },
            {
                $unwind: {
                    path: "$raisedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Related Work Update
            {
                $lookup: {
                    from: "updates",
                    localField: "relatedValue",
                    foreignField: "_id",
                    as: "relatedValue",
                },
            },
            {
                $unwind: {
                    path: "$relatedValue",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Acknowledged By User
            {
                $lookup: {
                    from: "users",
                    localField: "acknowledgedBy",
                    foreignField: "_id",
                    as: "acknowledgedBy",
                },
            },
            {
                $unwind: {
                    path: "$acknowledgedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Comment Users
            {
                $lookup: {
                    from: "users",
                    localField: "comments.userId",
                    foreignField: "_id",
                    as: "commentUsers",
                },
            },

            // Sort latest first
            {
                $sort: {
                    createdAt: -1,
                },
            },

            // Select required fields
            {
                $project: {
                    blockerTitle: 1,
                    severityLevel: 1,
                    whatNeed: 1,
                    status: 1,
                    escalationLevel: 1,
                    isEscalated: 1,
                    acknowledgedAt: 1,
                    resolvedAt: 1,
                    resolutionNote: 1,
                    comments: 1,
                    createdAt: 1,

                    whoMustAct: {
                        _id: "$whoMustAct._id",
                        fullName: "$whoMustAct.fullName",
                        email: "$whoMustAct.email",
                        imageUrl: "$whoMustAct.imageUrl",
                        designationId: "$whoMustAct.designationId",
                    },

                    raisedBy: {
                        _id: "$raisedBy._id",
                        fullName: "$raisedBy.fullName",
                        email: "$raisedBy.email",
                        imageUrl: "$raisedBy.imageUrl",
                        designationId: "$raisedBy.designationId",
                    },

                    relatedValue: {
                        _id: "$relatedValue._id",
                        doneYesterday: "$relatedValue.doneYesterday",
                        plannedToday: "$relatedValue.plannedToday",
                        createdAt: "$relatedValue.createdAt",
                    },

                    acknowledgedBy: {
                        _id: "$acknowledgedBy._id",
                        fullName: "$acknowledgedBy.fullName",
                        email: "$acknowledgedBy.email",
                        imageUrl: "$acknowledgedBy.imageUrl",
                        designationId: "$acknowledgedBy.designationId",
                    },

                    commentUsers: 1,
                },
            },
        ]);

        return blockers;
    } catch (error) {
        throw error;
    }
};

// Screen 06: Get single blocker details

const getBlockerByIdService = async (blockerId) => {
    try {
        const blockers = await BlockerModels.aggregate([
            {

                $match: {
                    raisedBy: new mongoose.Types.ObjectId(blockerId),
                },
            },

            // Join Target User
            {
                $lookup: {
                    from: "users",
                    localField: "whoMustAct",
                    foreignField: "_id",
                    as: "whoMustAct",
                },
            },
            {
                $unwind: {
                    path: "$whoMustAct",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Raised By User
            {
                $lookup: {
                    from: "users",
                    localField: "raisedBy",
                    foreignField: "_id",
                    as: "raisedBy",
                },
            },
            {
                $unwind: {
                    path: "$raisedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Related Work Update
            {
                $lookup: {
                    from: "updates",
                    localField: "relatedValue",
                    foreignField: "_id",
                    as: "relatedValue",
                },
            },
            {
                $unwind: {
                    path: "$relatedValue",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Acknowledged By User
            {
                $lookup: {
                    from: "users",
                    localField: "acknowledgedBy",
                    foreignField: "_id",
                    as: "acknowledgedBy",
                },
            },
            {
                $unwind: {
                    path: "$acknowledgedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Join Comment Users
            {
                $lookup: {
                    from: "users",
                    localField: "comments.userId",
                    foreignField: "_id",
                    as: "commentUsers",
                },
            },

            // Sort latest first
            {
                $sort: {
                    createdAt: -1,
                },
            },

            // Select required fields
            {
                $project: {
                    blockerTitle: 1,
                    severityLevel: 1,
                    whatNeed: 1,
                    status: 1,
                    escalationLevel: 1,
                    isEscalated: 1,
                    acknowledgedAt: 1,
                    resolvedAt: 1,
                    resolutionNote: 1,
                    comments: 1,
                    createdAt: 1,

                    whoMustAct: {
                        _id: "$whoMustAct._id",
                        fullName: "$whoMustAct.fullName",
                        email: "$whoMustAct.email",
                        imageUrl: "$whoMustAct.imageUrl",
                        designationId: "$whoMustAct.designationId",
                    },

                    raisedBy: {
                        _id: "$raisedBy._id",
                        fullName: "$raisedBy.fullName",
                        email: "$raisedBy.email",
                        imageUrl: "$raisedBy.imageUrl",
                        designationId: "$raisedBy.designationId",
                    },

                    relatedValue: {
                        _id: "$relatedValue._id",
                        doneYesterday: "$relatedValue.doneYesterday",
                        plannedToday: "$relatedValue.plannedToday",
                        createdAt: "$relatedValue.createdAt",
                    },

                    acknowledgedBy: {
                        _id: "$acknowledgedBy._id",
                        fullName: "$acknowledgedBy.fullName",
                        email: "$acknowledgedBy.email",
                        imageUrl: "$acknowledgedBy.imageUrl",
                        designationId: "$acknowledgedBy.designationId",
                    },

                    commentUsers: 1,
                },
            },
        ]);

        return blockers;
    } catch (error) {
        throw error;
    }
};


// Get escalated blockers (open > 24 hours or L1)
const getEscalatedBlockersService = async () => {
    const blockers = await getAllBlockersService();
    return blockers.filter((b) => b.isEscalated && b.status !== "Resolved" && b.status !== "Completed");
};

// Update blocker details
const updateBlockerService = async (updatedData) => {
    const { id, ...remainData } = updatedData || {};
    const response = await BlockerModels.findByIdAndUpdate(
        id,
        { $set: remainData },
        { runValidators: true, returnDocument: "after" }
    );
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

export {
    createBlockerService,
    acknowledgeBlockerService,
    resolveBlockerService,
    addBlockerCommentService,
    getAllBlockersService,
    getBlockerByIdService,
    getEscalatedBlockersService,
    updateBlockerService,
};
