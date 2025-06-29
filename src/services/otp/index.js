import { OTP_CONFIG } from "./otp-config.js";
import crypto from 'crypto'

export function generateOTP() {
    const { LENGTH } = OTP_CONFIG;
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < LENGTH; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}
