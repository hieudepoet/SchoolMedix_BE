import { supabaseAdmin } from "../../config/supabase.js";
import { supabaseClient } from "../../config/supabase.js";
import {
    insertAdmin,
    insertNurse,
    insertParent,
    insertStudent,
    getProfileByUUID,
} from "./userDao.js";
import { sendWelcomeEmail } from "../email/index.js";
import { generateRandomPassword } from "./userUtils.js";
import { sendInviteEmail } from "../email/senders/inviteSender.js";



export async function createSupabaseAuthUserWithRole(email, name, role) {
    const { data, error } = await supabaseAdmin.createUser({
        email,
        email_confirm: false,
        user_metadata: {},
        app_metadata: {
            role,
        },
    });

    if (error) {
        throw new Error("Tạo user trên supabase auth thất bại: " + error.message);
    }

    const { data: linkData, error: linkError } = await supabaseAdmin.generateLink({
        email,
        type: 'invite',
        options: {
            redirectTo: `${process.env.FIREBASE_FE_DEPLOYING_URL}/setup-password`,
        },
    });

    if (linkError) {
        throw new Error("Không tạo được link mời: " + linkError.message);
    }

    try {
        await sendInviteEmail(email, name, role, linkData.properties.action_link);
    } catch (mailErr) {
        console.error('❌ Gửi email thất bại:', mailErr);
        throw new Error('Đã tạo user nhưng gửi email mời thất bại.');
    }
    return {
        supabase_uid: data.user.id,
        invite_link: linkData.properties.action_link,
    };
}

export async function sendInviteLinkToEmails(users = []) {
    const tasks = users.map(async (user) => {
        const { email, name, role } = user;

        try {
            const { data: linkData, error: linkError } = await supabaseAdmin.generateLink({
                email,
                type: "invite",
                options: {
                    redirectTo: `${process.env.FIREBASE_FE_DEPLOYING_URL}/setup-password`,
                },
            });

            if (linkError) {
                throw new Error(`Tạo link mời thất bại: ${linkError.message}`);
            }

            await sendInviteEmail(email, name, role, linkData.action_link);

            return {
                email,
                error: false,
                supabase_uid: linkData.user.id,
                invite_link: linkData.action_link,
            };
        } catch (err) {
            console.error(`❌ Gửi email mời thất bại cho ${email}:`, err.message);
            return {
                email,
                error: true,
                message: err.message,
            };
        }
    });

    const results = await Promise.all(tasks);
    return results;
}

export async function createNewAdmin(
    email,
    name,
    dob,
    isMale,
    address,
    phone_number,
    profile_img_url
) {
    let supabase_uid = null;

    try {
        if (email) {
            const { supabase_uid: uid } = await createSupabaseAuthUserWithRole(email, name, "admin");
            supabase_uid = uid;
        }

        const addedUser = await insertAdmin(
            supabase_uid,
            email,
            name,
            dob,
            isMale,
            address,
            phone_number,
            profile_img_url
        );

        return addedUser;
    } catch (err) {
        if (supabase_uid) {
            await deleteAuthUser(supabase_uid).catch((delErr) =>
                console.error("❌ Rollback Supabase Auth thất bại:", delErr.message)
            );
        }
        throw err;
    }
}


export async function createNewNurse(
    email,
    name,
    dob,
    isMale,
    address,
    phone_number,
    profile_img_url
) {
    let supabase_uid = null;

    try {
        if (email) {
            const { supabase_uid: uid } = await createSupabaseAuthUserWithRole(email, name, "nurse");
            supabase_uid = uid;
        }

        return await insertNurse(
            supabase_uid,
            email,
            name,
            dob,
            isMale,
            address,
            phone_number,
            profile_img_url
        );
    } catch (err) {
        if (supabase_uid) {
            await deleteAuthUser(supabase_uid).catch((e) =>
                console.error("❌ Rollback Supabase Auth thất bại:", e.message)
            );
        }
        throw err;
    }
}

export async function createNewParent(
    email,
    name,
    dob,
    isMale,
    address,
    phone_number,
    profile_img_url
) {
    let supabase_uid = null;

    try {
        if (email) {
            const { supabase_uid: uid } = await createSupabaseAuthUserWithRole(email, name, "parent");
            supabase_uid = uid;
        }

        return await insertParent(
            supabase_uid,
            email,
            name,
            dob,
            isMale,
            address,
            phone_number,
            profile_img_url
        );
    } catch (err) {
        if (supabase_uid) {
            await deleteAuthUser(supabase_uid).catch((e) =>
                console.error("❌ Rollback Supabase Auth thất bại:", e.message)
            );
        }
        throw err;
    }
}

export async function createNewStudent(
    email,
    name,
    dob,
    isMale,
    address,
    phone_number,
    profile_img_url,
    class_id,
    year_of_enrollment,
    mom_id,
    dad_id
) {
    let supabase_uid = null;

    try {
        if (email) {
            const { supabase_uid: uid } = await createSupabaseAuthUserWithRole(email, name, "student");
            supabase_uid = uid;
        }

        return await insertStudent(
            supabase_uid,
            email,
            name,
            dob,
            isMale,
            address,
            phone_number,
            profile_img_url || process.env.DEFAULT_AVATAR_URL,
            class_id,
            year_of_enrollment,
            mom_id,
            dad_id
        );
    } catch (err) {
        if (supabase_uid) {
            await deleteAuthUser(supabase_uid).catch((e) =>
                console.error("❌ Rollback Supabase Auth thất bại:", e.message)
            );
        }
        throw err;
    }
}


// update email
export async function updateEmailForSupabaseAuthUser(supabase_uid, email) {
    const { data, error } = await supabaseAdmin.updateUserById(supabase_uid, {
        email,
    });

    if (error) {
        throw new Error(`Lỗi cập nhật email trên supabase auth: ${error.message}`);
    }

    return data;
}

export async function deleteAuthUser(supabase_uid) {
    const { error } = await supabaseAdmin.deleteUser(supabase_uid);

    if (error) {
        console.error('❌ Xóa người dùng thất bại:', error.message);
        throw error;
    }

    console.log('✅ Đã xóa người dùng khỏi Supabase Auth');
}

export async function generateRecoveryLink(email) {
    const { data, error } = await supabaseAdmin.generateLink({
        email,
        type: 'recovery',
        options: {
            redirectTo: `${process.env.FIREBASE_FE_DEPLOYING_URL}/forgot-password?step=4`,
        },
    });

    if (error) {
        throw new Error(`Không tạo được recovery link: ${error.message}`);
    }

    return data.properties.action_link;
}

export async function getUserByEmail(email) {
    const { data, error } = await supabaseAdmin.listUsers({
        perPage: 100,
        page: 1,
    });

    const user = data?.users?.find((u) => u.email === email);
    return user || null;
}
