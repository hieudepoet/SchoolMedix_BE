import { supabaseAdmin } from "../../config/supabase.js";
import { getProfileByUUID } from "./userDao.js";

export async function createUserWithRole(email, password, role) {
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

export async function signInWithPassAndEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw new Error(error.message || "Đăng nhập thất bại");
    }
    console.log(data.user);
    const role = data.user_metadata.role;
    const supabase_uid = data.user.id;
    const user = await getProfileByUUID(role, supabase_uid);


    return {
        data,
        user
    };
}




