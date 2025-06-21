import { query } from "../../config/database.js";

export async function insertAdmin(
    supabase_uid = null,
    email = null,
    name,
    dob,
    gender,
    address,
    phone_number = null,
    profile_img_url = process.env.DEFAULT_AVATAR_URL
) {
    const result = await query(`
    INSERT INTO Admin (
      supabase_uid, email, name, dob, gender, address,
      phone_number, profile_img_url
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id
  `, [
        supabase_uid,
        email,
        name,
        dob,
        gender,
        address,
        phone_number,
        profile_img_url
    ]);
    return result.rows[0].id;
}

export async function insertNurse(
    supabase_uid = null,
    email = null,
    name,
    dob,
    gender,
    address,
    phone_number = null,
    profile_img_url = process.env.DEFAULT_AVATAR_URL
) {
    const result = await query(`
    INSERT INTO Nurse (
      supabase_uid, email, name, dob, gender, address,
      phone_number, profile_img_url
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id
  `, [
        supabase_uid,
        email,
        name,
        dob,
        gender,
        address,
        phone_number,
        profile_img_url
    ]);
    return result.rows[0].id;
}

export async function insertParent(
    supabase_uid,
    email = null,
    name,
    dob,
    gender,
    address,
    phone_number = null,
    profile_img_url = process.env.DEFAULT_AVATAR_URL
) {
    const result = await query(`
    INSERT INTO Parent (
      supabase_uid, email, name, dob, gender, address,
      phone_number, profile_img_url
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id
  `, [
        supabase_uid,
        email,
        name,
        dob,
        gender,
        address,
        phone_number,
        profile_img_url
    ]);
    return result.rows[0].id;
}



export async function insertStudent(
    supabase_uid = null,
    email = null,
    name,
    dob,
    gender,
    address,
    phone_number = null,
    profile_img_url = process.env.DEFAULT_AVATAR_URL,
    class_id,
    year_of_enrollment,
    mom_id = null,
    dad_id = null
) {
    const student_id = await generateStudentCode(year_of_enrollment);

    await query(`
    INSERT INTO Student (
      id, supabase_uid, email, name, dob, gender, address,
      phone_number, profile_img_url, class_id, mom_id, dad_id
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12
    )
  `, [
        student_id, supabase_uid, email, name, dob, gender, address,
        phone_number, profile_img_url, class_id, mom_id, dad_id
    ]);

    return student_id;
}




