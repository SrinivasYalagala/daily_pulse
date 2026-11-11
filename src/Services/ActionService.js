import ActionModel from "../Models/ActionModels.js";

// S-01 : Create Action
const createActionService = async (actionData) => {
    if (actionData.primaryOwner && actionData.backupOwner) {
        if (actionData.primaryOwner.toString() === actionData.backupOwner.toString()) {
            throw new Error("DuplicateOwner");
        }
    }
    const response = await ActionModel.create({
        ...actionData,
        status: actionData.status || "Open",
    });
    return response;
};

// S-02 : Get All Actions

const getAllActionsService = async () => {
    return getActionRegisterService({ tab: "All" });
};

// S-03 : Get Actions by which are created by which user





// Helper to determine dynamic Overdue status
const processActionStatus = (action) => {
    const isCompleted = action.status === "Done" || action.status === "Completed";
    const now = new Date();
    const isOverdue = !isCompleted && action.dueDate && new Date(action.dueDate) < now;
    return {
        ...action,
        isOverdue,
        displayStatus: isCompleted ? "Done" : isOverdue ? "Overdue" : action.status === "In Progress" || action.status === "In prog." ? "In prog." : "Open",
    };
};



// Screen 10: Close Action (Mandatory closure note)
const closeActionService = async ({ id, userId, whatWasDone }) => {
    const response = await ActionModel.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "Done",
                closureNote: whatWasDone,
                closedAt: new Date(),
                closedBy: userId,
            },
        },
        { returnDocument: "after", runValidators: true }
    );
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

// Screen 08: Action Register (Tabs: Mine, Function, Overdue, All)
const getActionRegisterService = async ({ userId, tab = "All", functionName } = {}) => {
    // const actions = await ActionModel.find()
    //     .populate("primaryOwner", "fullName email designationId imageUrl")
    //     .populate("backupOwner", "fullName email designationId imageUrl")
    //     .populate("closedBy", "fullName email designationId imageUrl")
    //     .sort({ dueDate: 1 })
    //     .lean();
    const actions = await ActionModel.aggregate([
        // 1. Populate primaryOwner
        {
            $lookup: {
                from: "users",
                localField: "primaryOwner",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            designationId: 1,
                            imageUrl: 1,
                        },
                    },
                ],
                as: "primaryOwner",
            },
        },
        {
            $unwind: {
                path: "$primaryOwner",
                preserveNullAndEmptyArrays: true,
            },
        },

        // 2. Populate backupOwner
        {
            $lookup: {
                from: "users",
                localField: "backupOwner",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            designationId: 1,
                            imageUrl: 1,
                        },
                    },
                ],
                as: "backupOwner",
            },
        },
        {
            $unwind: {
                path: "$backupOwner",
                preserveNullAndEmptyArrays: true,
            },
        },

        // 3. Populate closedBy
        {
            $lookup: {
                from: "users",
                localField: "closedBy",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            designationId: 1,
                            imageUrl: 1,
                        },
                    },
                ],
                as: "closedBy",
            },
        },
        {
            $unwind: {
                path: "$closedBy",
                preserveNullAndEmptyArrays: true,
            },
        },

        // 4. Sort by dueDate ascending
        {
            $sort: {
                dueDate: 1,
            },
        },
    ]);

    const processed = actions.map(processActionStatus);

    if (tab === "Mine" && userId) {
        return processed.filter(
            (a) =>
                (a.primaryOwner && a.primaryOwner._id.toString() === userId.toString()) ||
                (a.backupOwner && a.backupOwner._id.toString() === userId.toString())
        );
    }

    if (tab === "Function" && functionName) {
        return processed.filter(
            (a) =>
                a.primaryOwner &&
                a.primaryOwner.designationId &&
                a.primaryOwner.designationId.toLowerCase() === functionName.toLowerCase()
        );
    }

    if (tab === "Overdue") {
        return processed.filter((a) => a.isOverdue);
    }

    return processed;
};



const getActionByIdService = async (actionId) => {
    const targetId = typeof actionId === "object" ? actionId.id : actionId;
    const action = await ActionModel.findById(targetId)
        .populate("primaryOwner", "fullName email designationId imageUrl")
        .populate("backupOwner", "fullName email designationId imageUrl")
        .populate("closedBy", "fullName email designationId imageUrl")
        .lean();

    if (!action) {
        throw new Error("NotFound");
    }
    return processActionStatus(action);
};

const updateActionService = async (updatedData) => {
    const { id, ...remainData } = updatedData || {};
    const response = await ActionModel.findByIdAndUpdate(
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
    createActionService,
    closeActionService,
    getActionRegisterService,
    getAllActionsService,
    getActionByIdService,
    updateActionService,
};
