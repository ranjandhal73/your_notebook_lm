import otpGenerator from "otp-generator";

export const generateOTP = () => {
    const otp = otpGenerator.generate(8,{
        digits: true,
        upperCaseAlphabets: true,
        lowerCaseAlphabets: true,
        specialChars: false
    })
    return otp;
}