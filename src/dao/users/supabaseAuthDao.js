import { supabaseAdmin } from "../../config/supabase.js";

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

    return data.user.id; // trả về uuid
}

export async function signInWithPassAndEmail() {

}