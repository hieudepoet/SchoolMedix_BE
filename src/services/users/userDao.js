import { query } from "../../config/database.js";
import { generateStudentCode } from "./userUtils.js"

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
    RETURNING *
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
  return result.rows[0];
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
    RETURNING *
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
  return result.rows[0];
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
    RETURNING *
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
  return result.rows[0];
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
  console.log(student_id);

  const result = await query(`
    INSERT INTO Student (
      id, supabase_uid, email, name, dob, gender, address,
      phone_number, profile_img_url, year_of_enrollment, class_id, mom_id, dad_id
    ) 
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    ) RETURNING *
  `, [
    student_id, supabase_uid, email, name, dob, gender, address,
    phone_number, profile_img_url, year_of_enrollment, class_id, mom_id, dad_id
  ]);

  return result.rows[0];
}

export async function getProfileOfAdminByID(admin_Id) {
  const result = await query('select * from admin where id = $1', [admin_Id]);
  return result.rows[0];
}

export async function getProfileOfNurseByID(nurse_id) {
  const result = await query('SELECT * FROM nurse WHERE id = $1', [nurse_id]);
  return result.rows[0];
}

export async function getProfileOfParentByID(parent_id) {
  const result = await query(`SELECT 
  row_to_json(p_with_students) AS parent_profile
FROM (
  SELECT 
    p.id,
    p.supabase_uid,
    p.email,
    p.name,
    p.dob,
    DATE_PART('year', AGE(p.dob)) AS age,
    p.gender,
    p.address,
    p.phone_number,
    p.profile_img_url,
    p.email_confirmed,
    
    COALESCE(
      json_agg(
        json_build_object(
          'id', s.id,
          'supabase_uid', s.supabase_uid,
          'email', s.email,
          'name', s.name,
          'age', DATE_PART('year', AGE(s.dob)),
          'dob', s.dob,
          'gender', s.gender,
          'address', s.address,
          'phone_number', s.phone_number,
          'profile_img_url', s.profile_img_url,
          'year_of_enrollment', s.year_of_enrollment,
          'email_confirmed', s.email_confirmed,
          'class_id', c.id,
          'class_name', c.name
        )
      ) FILTER (WHERE s.id IS NOT NULL),
      '[]'
    ) AS students

  FROM parent p
  LEFT JOIN student s ON s.mom_id = p.id OR s.dad_id = p.id
  LEFT JOIN class c ON c.id = s.class_id
  WHERE p.id = $1
  GROUP BY p.id
) p_with_students;`, [parent_id]);
  return result.rows[0];
}

export async function getProfileOfStudentByID(student_id) {
  const result = await query(`
  SELECT json_build_object(
  'id', s.id,
  'supabase_uid', s.supabase_uid,
  'email', s.email,
  'name', s.name,
  'dob', s.dob,
  'age', DATE_PART('year', AGE(s.dob)),
  'gender', s.gender,
  'address', s.address,
  'phone_number', s.phone_number,
  'profile_img_url', s.profile_img_url,
  'year_of_enrollment', s.year_of_enrollment,
  'email_confirmed', s.email_confirmed,
  'class_id', s.class_id,
  'class_name', c.name,

  ' mom_profile', CASE
    WHEN s.mom_id IS NOT NULL THEN json_build_object(
      'id', m.id,
      'name', m.name,
      'dob', m.dob,
      'age', DATE_PART('year', AGE(m.dob)),
      'email', m.email,
      'phone_number', m.phone_number,
      'gender', m.gender,
      'address', m.address,
      'profile_img_url', m.profile_img_url,
      'supabase_uid', m.supabase_uid,
      'email_confirmed', m.email_confirmed
    )
    ELSE NULL
  END,

  'dad_profile', CASE
    WHEN s.dad_id IS NOT NULL THEN json_build_object(
      'id', d.id,
      'name', d.name,
      'dob', d.dob,
      'age', DATE_PART('year', AGE(d.dob)),
      'email', d.email,
      'phone_number', d.phone_number,
      'gender', d.gender,
      'address', d.address,
      'profile_img_url', d.profile_img_url,
      'supabase_uid', d.supabase_uid,
      'email_confirmed', d.email_confirmed
    )
    ELSE NULL
  END


) AS student_profile
FROM student s
LEFT JOIN parent m ON m.id = s.mom_id
LEFT JOIN parent d ON d.id = s.dad_id
JOIN class c on c.id = s.class_id
WHERE s.id = $1;
`, [student_id]);
  return result.rows[0];
}

export async function getProfileOfAdminByUUID(supabase_uid) {
  const result = await query(
    `SELECT * FROM admin WHERE supabase_uid = $1`,
    [supabase_uid]
  );
  return result.rows[0];
}

export async function getProfileOfNurseByUUID(supabase_uid) {
  const result = await query(
    `SELECT * FROM nurse WHERE supabase_uid = $1`,
    [supabase_uid]
  );
  return result.rows[0];
}

export async function getProfileOfParentByUUID(supabase_uid) {
  const result = await query(
    `SELECT 
      row_to_json(p_with_students) AS parent_profile
    FROM (
      SELECT 
        p.id,
        p.supabase_uid,
        p.email,
        p.name,
        p.dob,
        DATE_PART('year', AGE(p.dob)) AS age,
        p.gender,
        p.address,
        p.phone_number,
        p.profile_img_url,
        p.email_confirmed,

        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'supabase_uid', s.supabase_uid,
              'email', s.email,
              'name', s.name,
              'age', DATE_PART('year', AGE(s.dob)),
              'dob', s.dob,
              'gender', s.gender,
              'address', s.address,
              'phone_number', s.phone_number,
              'profile_img_url', s.profile_img_url,
              'year_of_enrollment', s.year_of_enrollment,
              'email_confirmed', s.email_confirmed,
              'class_id', c.id,
              'class_name', c.name
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS students

      FROM parent p
      LEFT JOIN student s ON s.mom_id = p.id OR s.dad_id = p.id
      LEFT JOIN class c ON c.id = s.class_id
      WHERE p.supabase_uid = $1
      GROUP BY p.id
    ) p_with_students;`,
    [supabase_uid]
  );

  return result.rows[0];
}

export async function getProfileOfStudentByUUID(supabase_uid) {
  const result = await query(
    `SELECT json_build_object(
      'id', s.id,
      'supabase_uid', s.supabase_uid,
      'email', s.email,
      'name', s.name,
      'dob', s.dob,
      'age', DATE_PART('year', AGE(s.dob)),
      'gender', s.gender,
      'address', s.address,
      'phone_number', s.phone_number,
      'profile_img_url', s.profile_img_url,
      'year_of_enrollment', s.year_of_enrollment,
      'email_confirmed', s.email_confirmed,
      'class_id', s.class_id,
      'class_name', c.name,

      'mom_profile', CASE
        WHEN s.mom_id IS NOT NULL THEN json_build_object(
          'id', m.id,
          'name', m.name,
          'dob', m.dob,
          'age', DATE_PART('year', AGE(m.dob)),
          'email', m.email,
          'phone_number', m.phone_number,
          'gender', m.gender,
          'address', m.address,
          'profile_img_url', m.profile_img_url,
          'supabase_uid', m.supabase_uid,
          'email_confirmed', m.email_confirmed
        )
        ELSE NULL
      END,

      'dad_profile', CASE
        WHEN s.dad_id IS NOT NULL THEN json_build_object(
          'id', d.id,
          'name', d.name,
          'dob', d.dob,
          'age', DATE_PART('year', AGE(d.dob)),
          'email', d.email,
          'phone_number', d.phone_number,
          'gender', d.gender,
          'address', d.address,
          'profile_img_url', d.profile_img_url,
          'supabase_uid', d.supabase_uid,
          'email_confirmed', d.email_confirmed
        )
        ELSE NULL
      END
    ) AS student_profile
    FROM student s
    LEFT JOIN parent m ON m.id = s.mom_id
    LEFT JOIN parent d ON d.id = s.dad_id
    JOIN class c ON c.id = s.class_id
    WHERE s.supabase_uid = $1;
    `,
    [supabase_uid]
  );

  return result.rows[0];
}


export async function getAllAdmins() {
  const result = await query('SELECT * FROM admin ORDER BY id');
  return result.rows;
}

export async function getAllNurses() {
  const result = await query('SELECT * FROM nurse ORDER BY id');
  return result.rows;
}

export async function getAllParents() {
  const result = await query(`
    SELECT 
      row_to_json(p_with_students) AS parent_profile
    FROM (
      SELECT 
        p.id,
        p.supabase_uid,
        p.email,
        p.name,
        p.dob,
        DATE_PART('year', AGE(p.dob)) AS age,
        p.gender,
        p.address,
        p.phone_number,
        p.profile_img_url,
        p.email_confirmed,

        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'supabase_uid', s.supabase_uid,
              'email', s.email,
              'name', s.name,
              'age', DATE_PART('year', AGE(s.dob)),
              'dob', s.dob,
              'gender', s.gender,
              'address', s.address,
              'phone_number', s.phone_number,
              'profile_img_url', s.profile_img_url,
              'year_of_enrollment', s.year_of_enrollment,
              'email_confirmed', s.email_confirmed,
              'class_id', c.id,
              'class_name', c.name
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS students

      FROM parent p
      LEFT JOIN student s ON s.mom_id = p.id OR s.dad_id = p.id
      LEFT JOIN class c ON c.id = s.class_id
      GROUP BY p.id
    ) p_with_students
  `);

  return result.rows.map(row => row.parent_profile);
}

export async function getAllStudents() {
  const result = await query(`
    SELECT json_build_object(
      'id', s.id,
      'supabase_uid', s.supabase_uid,
      'email', s.email,
      'name', s.name,
      'dob', s.dob,
      'age', DATE_PART('year', AGE(s.dob)),
      'gender', s.gender,
      'address', s.address,
      'phone_number', s.phone_number,
      'profile_img_url', s.profile_img_url,
      'year_of_enrollment', s.year_of_enrollment,
      'email_confirmed', s.email_confirmed,
      'class_id', c.id,
      'class_name', c.name,

      'mom_profile', CASE
        WHEN s.mom_id IS NOT NULL THEN json_build_object(
          'id', m.id,
          'name', m.name,
          'dob', m.dob,
          'age', DATE_PART('year', AGE(m.dob)),
          'email', m.email,
          'phone_number', m.phone_number,
          'gender', m.gender,
          'address', m.address,
          'profile_img_url', m.profile_img_url,
          'supabase_uid', m.supabase_uid,
          'email_confirmed', m.email_confirmed
        )
        ELSE NULL
      END,

      'dad_profile', CASE
        WHEN s.dad_id IS NOT NULL THEN json_build_object(
          'id', d.id,
          'name', d.name,
          'dob', d.dob,
          'age', DATE_PART('year', AGE(d.dob)),
          'email', d.email,
          'phone_number', d.phone_number,
          'gender', d.gender,
          'address', d.address,
          'profile_img_url', d.profile_img_url,
          'supabase_uid', d.supabase_uid,
          'email_confirmed', d.email_confirmed
        )
        ELSE NULL
      END
    ) AS student_profile
    FROM student s
    LEFT JOIN parent m ON m.id = s.mom_id
    LEFT JOIN parent d ON d.id = s.dad_id
    LEFT JOIN class c ON c.id = s.class_id
    ORDER BY s.id;
  `);

  return result.rows.map(row => row.student_profile);
}

export async function linkParentsAndStudents(mom_id, dad_id, student_ids) {
  if (!Array.isArray(student_ids) || student_ids.length === 0) {
    throw new Error("Danh sách học sinh không hợp lệ.");
  }

  const result = await query(`
    UPDATE student
    SET
      mom_id = COALESCE($1, mom_id),
      dad_id = COALESCE($2, dad_id)
    WHERE id = ANY($3::text[])
    RETURNING id, mom_id, dad_id
  `, [mom_id, dad_id, student_ids]);

  return result.rows;
}

export async function removeMomByStudentId(student_id) {
  const result = await query(
    `UPDATE student SET mom_id = NULL WHERE id = $1 RETURNING id, mom_id`,
    [student_id]
  );
  return result.rows;
}

export async function removeDadByStudentId(student_id) {
  const result = await query(
    `UPDATE student SET dad_id = NULL WHERE id = $1 RETURNING id, dad_id`,
    [student_id]
  );
  return result.rows;
}


export async function confirmEmailFor(role, supabase_id, id) {
  const result = await query(`
    update ${role}
    set email_confirmed = true
    where supabase_id = $1 or id = $2
    returning *
    `, [supabase_id, id]);
  return result.rows[0];
}

export async function unconfirmEmail(role, supabase_id, id) {
  const result = await query(`
    update ${role}
    set email_confirmed = false
    where supabase_id = $1 or id = $2
    returning *
    `, [supabase_id, id]);
  return result.rows[0];
}

export async function getProfileByUUID(role) {
  let user = null;
  switch(role) {
    case "admin": user = getProfileOfAdminByID
  }
  
  return result.rows[0]
}