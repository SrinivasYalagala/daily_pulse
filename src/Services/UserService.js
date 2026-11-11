import UserModels from '../Models/UserModels.js';

const getUserDataService = async (userId) => {
    const { id } = userId || {};
    const response = await UserModels.findById(id);
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

const getAllUserService = async () => {
    const response = await UserModels.find()
        .select("_id fullName email designationId imageUrl")
        .sort({ fullName: 1 });
    if (!response) {
        throw new Error("NotFound");
    }
    return response;
};

export { getUserDataService, getAllUserService };