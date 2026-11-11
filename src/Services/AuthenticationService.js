import UserModels from "../Models/UserModels.js";
import speakeasy from 'speakeasy';
import QRCode from 'qrcode'
import { generateJwtToken } from "../Utils/Jwt_Token.js";

const registrationService = async (userData) => {
    const response = await UserModels.create(userData);
    return response;
}

const loginService = async (emailAddress) => {
    const response = await UserModels.findOne({ email: emailAddress }).lean();
    if (!response) {
        throw new Error("Not Found");
    }
    if (response.accountStatus != "Active") {
        throw new Error("InActive");
    }
    const is2FAEnabled = response.is2FAEnabled;
    if (!is2FAEnabled) {
        const generatedSecret = speakeasy.generateSecret({
            name: `Daily_Pulse (${emailAddress})`,
            issuer: "Daily_Pulse",
            length: 5
        });
        const secret = generatedSecret.base32;
        const otpauthUrl = speakeasy.otpauthURL({
            secret,
            label: emailAddress,
            issuer: "Daily_Pulse",
            encoding: "base32"
        });
        const qrCode = await QRCode.toDataURL(otpauthUrl);
        const data = { ...response, secret, qrCode };
        return data;
    }
    return response;
};

const authenticationSetupService = async (upatedData) => {
    const { email, totpSecret } = upatedData || {};
    const remainData = { totpSecret, is2FAEnabled: true };
    const response = await UserModels.findOneAndUpdate({ email }, { $set: remainData }, { runValidators: true, returnDocument: 'after' });
    return response;
};

const verifyAuthOtpService = async (otpData) => {
    const { email, otp } = otpData || {};
    const response = await UserModels.findOne({ email }).select("+totpSecret");
    console.log(response);
    const id = response._id;
    const roleId = response.roleId;
    const verified = speakeasy.totp.verify({
        secret: response.totpSecret,
        encoding: "base32",
        token: otp,
        window: 1
    });
    if (!verified) {
        throw new Error("Invalid");
    }
    const token = generateJwtToken(id, roleId);
    return { id, roleId, token };
};


export { registrationService, loginService, authenticationSetupService, verifyAuthOtpService };