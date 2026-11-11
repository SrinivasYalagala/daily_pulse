import AcknowledgementModels from "../Models/AcknowledgementModels.js";

const createAcknowledgementService = async (ackData) => {
    const response = await AcknowledgementModels.create(ackData);
    return response;
};

const getAcknowledgementByWorkIdService = async (workData) => {
    const { workId } = workData || {};
    const response = await AcknowledgementModels.find({ workId })
        .populate("fromUserId", "fullName email imageUrl designationId")
        .populate("toUserId", "fullName email imageUrl designationId")
        .sort({ createdAt: 1 });
    return response;
};

export {
    createAcknowledgementService,
    getAcknowledgementByWorkIdService,
};
