import { supabaseAdmin } from "../../config/supabase.js";
import { supabaseClient } from "../../config/supabase.js";
import {
    insertAdmin,
    insertNurse,
    insertParent,
    insertStudent,
    getProfileByUUID,
    confirmEmailFor
} from "./userDao.js";
import { sendWelcomeEmail } from "../email/index.js";
import { generateRandomPassword } from "./userUtils.js";



export async function createSupabaseAuthUserWithRole(email, password, role) {
    const { data, error } = await supabaseAdmin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {},
        app_metadata: {
            role,
        },
    });

    if (error) {
        throw new Error("Tạo user trên supabase auth thất bại: " + error.message);
    }

    return data.user.id;
}

export async function createNewAdmin(
    email,
    name,
    dob,
    gender,
    address,
    phone_number,
    profile_img_url
) {
    let supabase_uid = null;
    if (email) {
        const password = generateRandomPassword();
        supabase_uid = await createSupabaseAuthUserWithRole(email, password, "admin");
        await sendWelcomeEmail(email, name, "admin", password);
    }

    const addedUser = await insertAdmin(
        supabase_uid,
        email,
        name,
        dob,
        gender,
        address,
        phone_number,
        profile_img_url
    );

    return addedUser;
}

export async function createNewNurse(
    email,
    name,
    dob,
    gender,
    address,
    phone_number,
    profile_img_url
) {
    let supabase_uid = null;
    if (email) {
        const password = generateRandomPassword();
        supabase_uid = await createSupabaseAuthUserWithRole(email, password, "nurse");
        await sendWelcomeEmail(email, name, "nurse", password);
    }

    const addedUser = await insertNurse(
        supabase_uid,
        email,
        name,
        dob,
        gender,
        address,
        phone_number,
        profile_img_url
    );

    return addedUser;
}

export async function createNewParent(
    email,
    name,
    dob,
    gender,
    address,
    phone_number,
    profile_img_url
) {
    let supabase_uid = null;
    if (email) {
        const password = generateRandomPassword();
        supabase_uid = await createSupabaseAuthUserWithRole(email, password, "parent");
        await sendWelcomeEmail(email, name, "parent", password);
    }

    const addedUser = await insertParent(
        supabase_uid,
        email,
        name,
        dob,
        gender,
        address,
        phone_number,
        profile_img_url
    );

    return addedUser;
}

export async function createNewStudent(
    email,
    name,
    dob,
    gender,
    address,
    phone_number,
    profile_img_url,
    class_id,
    year_of_enrollment,
    mom_id,
    dad_id
) {
    let supabase_uid = null;
    if (email) {
        const password = generateRandomPassword();
        supabase_uid = await createSupabaseAuthUserWithRole(email, password, "student");
        await sendWelcomeEmail(email, name, "student", password);
    }

    const addedUser = await insertStudent(
        supabase_uid,
        email,
        name,
        dob,
        gender,
        address,
        phone_number,
        profile_img_url,
        class_id,
        year_of_enrollment,
        mom_id,
        dad_id
    );

    return addedUser;
}

// update email
export async function updateEmailForUser(supabase_uid, email) {
    const { data, error } = await supabaseAdmin.updateUserById(supabase_uid, {
        email,
    });

    if (error) {
        throw new Error(`Lỗi cập nhật email: ${error.message}`);
    }

    return data;
}

export async function signInWithPassAndEmail(email, password) {
    const { data, error } = await supabaseClient.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message || "Đăng nhập thất bại");
    }
    const userInfo = data.user;
    const role = userInfo.app_metadata.role;
    const supabase_uid = userInfo.id;

    if (!role) {
        throw new Error("Tài khoản không có role được xác định.");
    }


    const profile = await getProfileByUUID(role, supabase_uid);

    return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
            supabase_uid,
            email: userInfo.email,
            role,
            profile
        }
    };
}

export async function updatePassword(newPassword, accessToken) {
    const { data, error } = await supabase.auth.updateUser(
        {
            password: newPassword
        },
        {
            accessToken
        }
    );

    if (error) {
        throw new Error(error.message || 'Cập nhật mật khẩu thất bại.');
    }

    return data;
}


