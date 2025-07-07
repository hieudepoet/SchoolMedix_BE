import { OTP_CONFIG } from "./otp-config.js";
import crypto from 'crypto';
import { query } from '../../config/database.js';
import { error } from "console";

export function generateOTP(purpose = 'DEFAULT') {
    const { LENGTH } = OTP_CONFIG[purpose] || OTP_CONFIG.DEFAULT;
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < LENGTH; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

export async function insertNewOTP(target, purpose = 'DEFAULT') {
    const config = OTP_CONFIG[purpose] || OTP_CONFIG.DEFAULT;
    const otp = generateOTP(purpose);
    const now = new Date();
    const expires_at = new Date(now.getTime() + config.EXPIRATION_TIME);

    // Xoá các OTP chưa dùng cho cùng target + purpose
    await query(`
        DELETE FROM otps
        WHERE target = $1 AND purpose = $2 AND is_used = false
    `, [target, purpose]);

    // Thêm OTP mới
    await query(`
        INSERT INTO otps (
            target, purpose, otp, expires_at, is_used
        ) VALUES (
            $1, $2, $3, $4, false
        )
    `, [target, purpose, otp, expires_at]);
    return otp;
}

export async function hasUsingOTP(target, purpose = 'DEFAULT') {
    const now = new Date();

    const result = await query(`
        SELECT 1 FROM otps
        WHERE target = $1
          AND purpose = $2
          AND is_used = false
          AND expires_at > $3
        LIMIT 1
    `, [target, purpose, now]);

    return result.rowCount > 0;

}

export async function verifyOTP(target, inputOTP, purpose = 'DEFAULT') {
    const result = await query(`
        SELECT * FROM otps 
        WHERE target = $1 AND purpose = $2 AND is_used = false
        ORDER BY created_at DESC
        LIMIT 1
    `, [target, purpose]);
    const record = result.rows[0];

    if (!record || record.expires_at <= new Date()) {
        updateOTPHasBeenUsed(target, purpose);
        return false;
    }

    return record.otp === inputOTP;
}

export async function updateOTPHasBeenUsed(target, purpose) {
    await query(`UPDATE otps SET is_used = true WHERE target = $1 and purpose = $2`, [target, purpose]);
}
