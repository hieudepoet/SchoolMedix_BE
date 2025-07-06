export const OTP_CONFIG = {
    DEFAULT: {
        EXPIRATION_TIME: 1 * 60 * 1000, // 5 phút
        LENGTH: 6,
        MAX_ATTEMPTS: 3,
    },
    verify_email: {
        EXPIRATION_TIME: 1 * 60 * 1000,
        MAX_ATTEMPTS: 5,
        LENGTH: 6,
    },
    reset_password: {
        EXPIRATION_TIME: 1 * 60 * 1000,
        MAX_ATTEMPTS: 3,
        LENGTH: 6,
    },
    forgot_password: {
        EXPIRATION_TIME: 2 * 60 * 1000,
        MAX_ATTEMPTS: 3,
        LENGTH: 6,
    },
    login_otp: {
        EXPIRATION_TIME: 1 * 60 * 1000,
        MAX_ATTEMPTS: 3,
        LENGTH: 6,
    },
};
