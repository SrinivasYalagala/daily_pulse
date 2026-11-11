import UpdateModels from "../Models/UpdateModels.js";
import AcknowledgementModels from "../Models/AcknowledgementModels.js";
import BlockerModels from "../Models/BlockerModels.js";
import UserModels from "../Models/UserModels.js";

// 1. Create Update (Screen 04: Post Daily Update)
const createUpdateService = async (updateData) => {
    const calculatedStatus = getWorkStatus();
    const data = { ...updateData, "status": calculatedStatus.india.status };
    const response = await UpdateModels.create(data);
    return response;
};

// 2. Get Updates Based on user assigned to them
const getUpdatesByUserService = async (userData) => {
    const { userId } = userData || {};
    const response = await UpdateModels.find({ userId: userId }).sort({ createdAt: -1 });
    return response;
};


// Screen 03: Today Board (Home) Aggregation
const getTodayBoardService = async (filters = {}) => {
    const targetDate = filters.date ? new Date(filters.date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Fetch active team members
    const userQuery = {
        accountStatus: "Active",
        isDeleted: false,
    };
    if (filters.function && filters.function.toLowerCase() !== "all") {
        userQuery.designationId = new RegExp(`^${filters.function}$`, "i");
    }

    const users = await UserModels.find(userQuery).select("fullName email designationId imageUrl").lean();
    const userIds = users.map((u) => u._id);

    // 2. Fetch today's updates for these users
    const updates = await UpdateModels.find({
        userId: { $in: userIds },
        $or: [
            { date: { $gte: startOfDay, $lte: endOfDay } },
            { createdAt: { $gte: startOfDay, $lte: endOfDay } },
        ],
    }).lean();

    // Map updates by userId
    const updateByUser = new Map();
    for (const up of updates) {
        updateByUser.set(up.userId.toString(), up);
    }

    // 3. Fetch active blockers
    const openBlockers = await BlockerModels.find({
        status: { $nin: ["Completed", "Resolved"] },
    }).lean();

    // Map open blockers count per user (assigned to whoMustAct)
    const blockerCountByUser = new Map();
    for (const b of openBlockers) {
        if (b.whoMustAct) {
            const key = b.whoMustAct.toString();
            blockerCountByUser.set(key, (blockerCountByUser.get(key) || 0) + 1);
        }
    }

    // 4. Construct Board members list & metrics
    let updatedCount = 0;
    let lateCount = 0;
    let missingCount = 0;

    const board = users.map((user) => {
        const userUpdate = updateByUser.get(user._id.toString());
        const openBlockersCount = blockerCountByUser.get(user._id.toString()) || 0;

        let status = "MISSING";
        if (userUpdate) {
            const s = (userUpdate.status || "").toUpperCase();
            if (s === "LATE") {
                status = "LATE";
                lateCount++;
            } else {
                status = "UPDATED";
                updatedCount++;
            }
        } else {
            missingCount++;
        }

        return {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                function: user.designationId || "General",
                imageUrl: user.imageUrl,
            },
            status, // UPDATED | LATE | MISSING
            openBlockersCount,
            update: userUpdate || null,
        };
    });

    return {
        date: targetDate.toISOString().split("T")[0],
        metrics: {
            updated: updatedCount,
            late: lateCount,
            missing: missingCount,
            blockers: openBlockers.length,
            totalMembers: users.length,
        },
        board,
    };
};

// 2. Update UpdateStatus
const updateStatusService = async (statusData) => {
    const { id, status } = statusData || {};
    const response = await UpdateModels.findByIdAndUpdate(
        id,
        { $set: { status } },
        { runValidators: true, returnDocument: "after" }
    );
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

// 3. Get Todays Updates
const getTodaysUpdatesService = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await UpdateModels.find({
        $or: [
            { date: { $gte: startOfDay, $lte: endOfDay } },
            { createdAt: { $gte: startOfDay, $lte: endOfDay } },
        ],
    })
        .populate("userId", "fullName email imageUrl designationId")
        .populate("relatedAction", "title priority status")
        .sort({ createdAt: -1 });

    return response;
};

// 4. Get All Updates
const getAllUpdatesService = async () => {
    const response = await UpdateModels.find()
        .populate("userId", "fullName email imageUrl designationId")
        .populate("relatedAction", "title priority status")
        .sort({ createdAt: -1 });
    return response;
};


// Helper: Get update by ID with acknowledgements and blockers
const getUpdateByIdService = async (updateId) => {
    const { id } = updateId || {};
    const targetId = id || updateId;
    const update = await UpdateModels.findById(targetId).populate("userId", "fullName email imageUrl designationId");
    if (!update) {
        throw new Error("NotFound");
    }
    const [acknowledgements, blockers] = await Promise.all([
        AcknowledgementModels.find({ workId: targetId })
            .populate("fromUserId", "fullName email imageUrl designationId")
            .populate("toUserId", "fullName email imageUrl designationId")
            .sort({ createdAt: 1 }),
        BlockerModels.find({ relatedTo: "Update", relatedValue: targetId }).sort({ createdAt: 1 }),
    ]);
    return {
        ...update.toObject(),
        acknowledgements,
        blockers,
    };
};

export {
    createUpdateService,
    getTodayBoardService,
    updateStatusService,
    getTodaysUpdatesService,
    getAllUpdatesService,
    getUpdatesByUserService,
    getUpdateByIdService,
    // aliases
    getUpdatesByUserService as getUpdateByUserIdService,
    updateStatusService as updateUpdateService,
};


const getWorkStatus = (createdAt = new Date()) => {

    const getTime = (timezone) => {
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        });

        const parts = formatter.formatToParts(new Date(createdAt));

        const hours = Number(parts.find(p => p.type === "hour").value);
        const minutes = Number(parts.find(p => p.type === "minute").value);

        return { hours, minutes };
    };

    const checkLate = (time) => {
        return time.hours > 18 ||
            (time.hours === 18 && time.minutes > 0);
    };

    const indiaTime = getTime("Asia/Kolkata");
    const usTime = getTime("America/New_York");

    return {
        india: {
            time: indiaTime,
            status: checkLate(indiaTime) ? "Late" : "Updated",
        },
        usa: {
            time: usTime,
            status: checkLate(usTime) ? "Late" : "Updated",
        },
    };
};