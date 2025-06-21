import {
    insertAdmin,
    insertNurse,
    insertParent,
    insertStudent,
} from "../../dao/index.js";

import { sendWelcomeEmail } from "../email/index.js";

import { createUserWithRole } from "../../dao/index.js";
import { generateRandomPassword } from "../../utils/index.js";

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
        supabase_uid = await createUserWithRole(email, password, "admin");
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
        supabase_uid = await createUserWithRole(email, password, "nurse");
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
        supabase_uid = await createUserWithRole(email, password, "parent");
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
        supabase_uid = await createUserWithRole(email, password, "student");
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
