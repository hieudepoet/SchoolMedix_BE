DO $$ DECLARE
    r RECORD;
BEGIN
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Drop all types (like ENUM)
    FOR r IN (SELECT n.nspname, t.typname
              FROM pg_type t
              JOIN pg_namespace n ON n.oid = t.typnamespace
              WHERE t.typtype = 'e' AND n.nspname = 'public') LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;

    -- Drop all sequences
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;

END $$;

SET TIME ZONE 'Asia/Ho_Chi_Minh';

-- grade
CREATE TABLE grade (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO grade (name) VALUES
('khối 1'),
('khối 2'),
('khối 3'),
('khối 4'),
('khối 5');


-- class
CREATE TABLE class (
    id SERIAL PRIMARY KEY,
    grade_id INT REFERENCES grade(id),
    name VARCHAR(50) NOT NULL
);

-- Giả sử grade.id từ 1 đến 5 tương ứng với "khối 1" đến "khối 5"
INSERT INTO class (grade_id, name) VALUES
(1, 'lớp 1A'),
(1, 'lớp 1B'),
(2, 'lớp 2A'),
(2, 'lớp 2B'),
(3, 'lớp 3A'),
(3, 'lớp 3B'),
(4, 'lớp 4A'),
(4, 'lớp 4B'),
(5, 'lớp 5A'),
(5, 'lớp 5B');


--Admin
CREATE TABLE Admin (
  id SERIAL PRIMARY KEY,
  supabase_uid UUID UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) not null,
  dob DATE not null,
  isMale BOOLEAN not null,
  address TEXT not null,
  phone_number VARCHAR(20),
  profile_img_url TEXT,
  email_confirmed BOOLEAN DEFAULT false not null,
  is_deleted BOOLEAN DEFAULT false not null,
  last_invitation_at TIMESTAMP DEFAULT null,
  created_at TIMESTAMP DEFAULT now()
);
-- start admin id from 100000
ALTER SEQUENCE admin_id_seq RESTART WITH 100000;

INSERT INTO Admin (
  supabase_uid,
  email,
  name,
  dob,
  isMale,
  address,
  phone_number,
  profile_img_url,
  email_confirmed,
  last_invitation_at,
  created_at
)
VALUES (
  '1cbb67d3-eaa9-48f4-a577-dcf6bfee9bbb',
  'mndkhanh@gmail.com',
  'Trần Văn Thánh',
  '1977-05-10',
  true,
  'Chung cư cao cấp Vinhomes, Hà nội',
  '0123456789',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
  true,
  '2025-06-14 07:26:19',
  '2025-06-14 07:26:19'
);


--Nurse
CREATE TABLE Nurse (
  id SERIAL PRIMARY KEY,
  supabase_uid UUID UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) not null,
  dob DATE not null,
  isMale BOOLEAN not null,
  address TEXT not null,
  phone_number VARCHAR(20),
  profile_img_url TEXT,
  email_confirmed BOOLEAN DEFAULT false not null,
  is_deleted BOOLEAN DEFAULT false not null,
  last_invitation_at TIMESTAMP DEFAULT null,
  created_at TIMESTAMP DEFAULT now()
);
-- start nurse id from 100000
ALTER SEQUENCE nurse_id_seq RESTART WITH 100000;

-- Câu lệnh INSERT đầy đủ
INSERT INTO Nurse (
  supabase_uid,
  email,
  name,
  dob,
  isMale,
  address,
  phone_number,
  profile_img_url,
  email_confirmed,
  last_invitation_at,
  created_at
)
VALUES (
  '322526ca-3a47-494a-a0fa-4866f0af9477',
  'mndkhanh3@gmail.com',
  'Nguyễn Ngọc Quyên',
  '1977-05-10',
  false,
  'Chung cư Xài Bầu, Hà nội',
  '0123456789',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
  true,
  '2025-06-14 07:26:19',
  '2025-06-14 07:26:19'
);




-- Parent
CREATE TABLE Parent (
  id SERIAL PRIMARY KEY,
  supabase_uid UUID UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) not null,
  dob DATE not null,
  isMale BOOLEAN not null,
  address TEXT not null,
  phone_number VARCHAR(20),
  profile_img_url TEXT,
  email_confirmed BOOLEAN DEFAULT false not null,
  is_deleted BOOLEAN DEFAULT false not null,
  last_invitation_at TIMESTAMP DEFAULT null,
  created_at TIMESTAMP DEFAULT now()
);

-- start parent id from 100000
ALTER SEQUENCE parent_id_seq RESTART WITH 100000;

INSERT INTO parent (
  supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url,
  email_confirmed, last_invitation_at, created_at
) VALUES
  (
    'be258789-4fe3-421c-baed-53ef3ed87f3b',
    'phamthanhqb2005@gmail.com',
    'Mai Nguyễn Duy Khánh',
    '1989-03-10',
    true,
    'Xóm trọ Cần Co, Hà Nội',
    '0123456789',
    'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
    true,
    '2025-06-14 07:26:19',
    '2025-06-14 07:26:19'
  ),
  (
    '3dfa7d35-7f0f-449f-afbf-bb6e420016d2',
    'dathtse196321@gmail.com',
    'Đinh Việt Hiếu',
    '1974-03-10',
    true,
    'Chợ Lớn, Hà Nội',
    '0123456789',
    'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
    true,
    '2025-06-14 07:26:19',
    '2025-06-14 07:26:19'
  ),
  (
    '00f7f4c0-4998-4593-b9c4-6b8d74596cd9',
    'mndkhanh.alt3@gmail.com',
    'Hoàng Tấn Đạt',
    '1980-05-09',
    true,
    'Chung cư Xóm Nhỏ, Quận Hoàn Kiếm, Hà Nội',
    '0123456789',
    'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
    true,
    '2025-06-14 07:26:19',
    '2025-06-14 07:26:19'
  ),
  (
    '81705d11-3052-4d70-82f2-1c11e8077dbe',
    'mndkhanh.alt@gmail.com',
    'Phạm Thành Phúc',
    '1985-05-22',
    true,
    'Vinhomes Smart City, Hồ Tây, Hà Nội',
    '0123321123',
    'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
    true,
    '2025-06-14 07:26:19',
    '2025-06-14 07:26:19'
  );

-- RESTART parent_id để bắt đầu từ 100004 nếu cần
ALTER SEQUENCE parent_id_seq RESTART WITH 100004;
INSERT INTO parent (
  name, dob, isMale, address, phone_number, profile_img_url, last_invitation_at, created_at
)
VALUES
('Nguyễn Văn An',  '1980-01-01', true,  'Hà Nội', '0900000001', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Trần Thị Bình',  '1982-02-02', false, 'Hà Nội', '0900000002', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Lê Văn Cường',  '1981-03-03', true,  'Hà Nội', '0900000003', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Phạm Thị Dung',  '1983-04-04', false, 'Hà Nội', '0900000004', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Vũ Văn Em',      '1979-05-05', true,  'Hà Nội', '0900000005', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Hoàng Thị Gấm',  '1981-06-06', false, 'Hà Nội', '0900000006', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Đào Văn Hưng',   '1980-07-07', true,  'Hà Nội', '0900000007', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Nguyễn Thị Hòa', '1982-08-08', false, 'Hà Nội', '0900000008', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Bùi Văn Khoa',   '1981-09-09', true,  'Hà Nội', '0900000009', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Lê Thị Lan',     '1984-10-10', false, 'Hà Nội', '0900000010', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Phạm Văn Minh',  '1980-11-11', true,  'Hà Nội', '0900000011', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Võ Thị Ngọc',    '1983-12-12', false, 'Hà Nội', '0900000012', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Trịnh Văn Quân', '1981-01-13', true,  'Hà Nội', '0900000013', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Mai Thị Quỳnh',  '1984-02-14', false, 'Hà Nội', '0900000014', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Ngô Văn Sơn',    '1980-03-15', true,  'Hà Nội', '0900000015', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Đinh Thị Trang', '1983-04-16', false, 'Hà Nội', '0900000016', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Trần Văn Út',    '1979-05-17', true,  'Hà Nội', '0900000017', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Vũ Thị Vân',     '1982-06-18', false, 'Hà Nội', '0900000018', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Hoàng Văn Xuân','1980-07-19', true,  'Hà Nội', '0900000019', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Đặng Thị Yến',   '1983-08-20', false, 'Hà Nội', '0900000020', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Phan Văn Đông',  '1981-09-21', true,  'Hà Nội', '0900000021', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Nguyễn Thị Hoa', '1984-10-22', false, 'Hà Nội', '0900000022', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Bùi Văn Nam',    '1980-11-23', true,  'Hà Nội', '0900000023', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Trần Thị Hà',    '1983-12-24', false, 'Hà Nội', '0900000024', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Lê Văn Dũng',    '1981-01-25', true,  'Hà Nội', '0900000025', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Phạm Thị Oanh',  '1984-02-26', false, 'Hà Nội', '0900000026', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Nguyễn Văn Trí','1980-03-27', true,  'Hà Nội', '0900000027', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Hoàng Thị Mai',  '1983-04-28', false, 'Hà Nội', '0900000028', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Đỗ Văn Toàn',    '1981-05-29', true,  'Hà Nội', '0900000029', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59'),
('Vũ Thị Thu',     '1984-06-30', false, 'Hà Nội', '0900000030', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files/anonymous-avatar.jpg', null, '2025-06-30 23:59:59');


--Student
CREATE TABLE student_code_counter (
  year_of_enrollment INT PRIMARY KEY,
  last_number INT DEFAULT 1000
);

insert into student_code_counter (year_of_enrollment, last_number) VALUES 
(2021, 1003); -- bắt đầu với 4 học sinh trong data mẫu 211000, 211001, 211002, 211003

CREATE TABLE Student (
      id varchar(10) PRIMARY KEY,
	    supabase_uid UUID unique,
      email VARCHAR(255) UNIQUE,
      name VARCHAR(255) not null,
      dob DATE not null,
      isMale BOOLEAN not null,
      address TEXT not null,
      phone_number VARCHAR(20),
      profile_img_url TEXT,
      year_of_enrollment int not null,
      email_confirmed BOOLEAN DEFAULT false not null,
      class_id INT REFERENCES class(id) not null,
      mom_id int REFERENCES parent(id),
      dad_id int REFERENCES parent(id),
  is_deleted BOOLEAN DEFAULT false not null,
  last_invitation_at TIMESTAMP DEFAULT null,
  created_at TIMESTAMP DEFAULT now()
);

INSERT INTO Student (
  id,
  supabase_uid,
  email,
  name,
  dob,
  isMale,
  address,
  phone_number,
  profile_img_url,
  year_of_enrollment,
  email_confirmed,
  class_id,
  mom_id,
  dad_id,
  last_invitation_at,
  created_at
)
VALUES 
(
  '211000',
  '550934ca-e6ee-456f-b40c-d7fdc173342b',
  'toannangcao3000@gmail.com',
  'Phạm Thành Kiến',
  '2015-05-10',
  true,
  'Vinhomes Smart City, Hồ Tây, Hà Nội',
  '0123456789',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
  2021,
  true,
  1,
  100003,
  NULL,
  '2025-06-15 12:00:00',
  '2025-06-15 12:00:00'
),
(
  '211001',
  'fc57f7ed-950e-46fb-baa5-7914798e9ae3',
  'dinhviethieu2910@gmail.com',
  'Hoàng Tấn Tạ Yến',
  '2014-02-10',
  false,
  'Chung cư Xóm Nhỏ, Quận Hoàn Kiếm, Hà Nội',
  '0123456789',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
  2021,
  true,
  2,
  100003,
  100002,
  '2025-06-15 12:00:00',
  '2025-06-15 12:00:00'
),
(
  '211002',
  '1519af26-f341-471b-8471-ab33a061b657',
  'thuandtse150361@fpt.edu.vn',
  'Mai Triệu Phú',
  '2013-02-10',
  true,
  'Xóm trọ Cần Co, Hà Nội',
  '0123456789',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
  2021,
  true,
  2,
  NULL,
  100000,
  '2025-06-15 12:00:00',
  '2025-06-15 12:00:00'
),
(
  '211003',
  'ab9f1dc3-8b35-4b0c-9327-f677c3247143',
  'coccamco.fpthcm@gmail.com',
  'Mai Thanh Trieu Phu',
  '2013-02-10',
  false,
  'Xóm trọ Cần Co, Hà Nội',
  '0123456789',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
  2021,
  true,
  2,
  100001,
  100000,
  '2025-06-15 12:00:00',
  '2025-06-15 12:00:00'
);

-- Cập nhật student_code_counter để phản ánh số học sinh mới
UPDATE student_code_counter
SET last_number = 1033
WHERE year_of_enrollment = 2021;

INSERT INTO student (
  id, name, dob, isMale, address, phone_number, profile_img_url,
  year_of_enrollment, class_id, mom_id, dad_id,
  last_invitation_at, created_at
)
VALUES
-- 15 học sinh lớp 1
('211004', 'Nguyễn An Khang', '2015-01-01', false, 'Hà Nội', '0901000001', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100005, 100004, NULL, '2025-06-30 23:59:59'),
('211005', 'Trần Gia Hưng', '2015-01-02', false, 'Hà Nội', '0901000002', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100007, 100006, NULL, '2025-06-30 23:59:59'),
('211006', 'Lê Ngọc Bảo', '2015-01-03', true, 'Hà Nội', '0901000003', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100009, 100008, NULL, '2025-06-30 23:59:59'),
('211007', 'Phạm Nhật Minh', '2015-01-04', true, 'Hà Nội', '0901000004', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100011, 100010, NULL, '2025-06-30 23:59:59'),
('211008', 'Vũ Tuệ Nhi', '2015-01-05', true, 'Hà Nội', '0901000005', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100013, 100012, NULL, '2025-06-30 23:59:59'),
('211009', 'Đào Hải Đăng', '2015-01-06', true, 'Hà Nội', '0901000006', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100015, 100014, NULL, '2025-06-30 23:59:59'),
('211010', 'Nguyễn Nhật Linh', '2015-01-07', true, 'Hà Nội', '0901000007', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100017, 100016, NULL, '2025-06-30 23:59:59'),
('211011', 'Bùi Hoàng Long', '2015-01-08', true, 'Hà Nội', '0901000008', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100019, 100018, NULL, '2025-06-30 23:59:59'),
('211012', 'Phạm Mai Chi', '2015-01-09', true, 'Hà Nội', '0901000009', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100021, 100020, NULL, '2025-06-30 23:59:59'),
('211013', 'Trịnh Minh Nhật', '2015-01-10', true, 'Hà Nội', '0901000010', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100023, 100022, NULL, '2025-06-30 23:59:59'),
('211014', 'Ngô Gia Bảo', '2015-01-11', true, 'Hà Nội', '0901000011', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100025, 100024, NULL, '2025-06-30 23:59:59'),
('211015', 'Đinh Hồng Anh', '2015-01-12', true, 'Hà Nội', '0901000012', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100027, 100026, NULL, '2025-06-30 23:59:59'),
('211016', 'Trần Quang Duy', '2015-01-13', true, 'Hà Nội', '0901000013', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100029, 100028, NULL, '2025-06-30 23:59:59'),
('211017', 'Vũ Thanh Trúc', '2015-01-14', true, 'Hà Nội', '0901000014', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100031, 100030, NULL, '2025-06-30 23:59:59'),
('211018', 'Hoàng Nhật Tân', '2015-01-15', true, 'Hà Nội', '0901000015', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 1, 100033, 100032, NULL, '2025-06-30 23:59:59'),

-- 15 học sinh lớp 2
('211019', 'Trần Gia Huy', '2014-01-01', true, 'Hà Nội', '0902000001', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100005, 100004, NULL, '2025-06-30 23:59:59'),
('211020', 'Vũ Hải Yến', '2014-01-02', true, 'Hà Nội', '0902000002', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100007, 100006, NULL, '2025-06-30 23:59:59'),
('211021', 'Hoàng Minh Khôi', '2014-01-03', false, 'Hà Nội', '0902000003', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100009, 100008, NULL, '2025-06-30 23:59:59'),
('211022', 'Đặng Ngọc Trinh', '2014-01-04', false, 'Hà Nội', '0902000004', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100011, 100010, NULL, '2025-06-30 23:59:59'),
('211023', 'Phan Đức Anh', '2014-01-05', false, 'Hà Nội', '0902000005', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100013, 100012, NULL, '2025-06-30 23:59:59'),
('211024', 'Nguyễn Minh Thư', '2014-01-06', false, 'Hà Nội', '0902000006', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100015, 100014, NULL, '2025-06-30 23:59:59'),
('211025', 'Bùi Nhật Hào', '2014-01-07', false, 'Hà Nội', '0902000007', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100017, 100016, NULL, '2025-06-30 23:59:59'),
('211026', 'Trần Khánh Vy', '2014-01-08', false, 'Hà Nội', '0902000008', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100019, 100018, NULL, '2025-06-30 23:59:59'),
('211027', 'Lê Hoàng Anh', '2014-01-09', true, 'Hà Nội', '0902000009', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100021, 100020, NULL, '2025-06-30 23:59:59'),
('211028', 'Phạm Thảo Nhi', '2014-01-10', true, 'Hà Nội', '0902000010', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100023, 100022, NULL, '2025-06-30 23:59:59'),
('211029', 'Nguyễn Minh Hiếu', '2014-01-11', true, 'Hà Nội', '0902000011', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100025, 100024, NULL, '2025-06-30 23:59:59'),
('211030', 'Trịnh Hồng Nhung', '2014-01-12', false, 'Hà Nội', '0902000012', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100027, 100026, NULL, '2025-06-30 23:59:59'),
('211031', 'Hoàng Thế Anh', '2014-01-13', true, 'Hà Nội', '0902000013', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100029, 100028, NULL, '2025-06-30 23:59:59'),
('211032', 'Ngô Ánh Tuyết', '2014-01-14', false, 'Hà Nội', '0902000014', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100031, 100030, NULL, '2025-06-30 23:59:59'),
('211033', 'Đào Khánh Duy', '2014-01-15', true, 'Hà Nội', '0902000015', 'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg', 2021, 2, 100033, 100032, NULL, '2025-06-30 23:59:59');




---------------------------------------------------------------------FLOW SEND MEDICATION REQUEST 
-------------------------------------------------------------------------------------------------

CREATE TYPE senddrugrequest_status AS ENUM (
    'PROCESSING',
    'ACCEPTED',
    'RECEIVED',
    'DONE',
    'CANCELLED',
    'REFUSED'
);

CREATE TABLE SendDrugRequest (
    id SERIAL PRIMARY KEY,
	  student_id varchar(10) references student(id), 
	  create_by int references parent(id),
    diagnosis TEXT NOT NULL,
    schedule_send_date DATE,
    receive_date DATE,
    intake_date DATE,
    note TEXT,
    prescription_img_urls TEXT[],
    status senddrugrequest_status NOT NULL
);

INSERT INTO SendDrugRequest (
    student_id, create_by, diagnosis, schedule_send_date, receive_date,
    intake_date, note, prescription_img_urls, status
) VALUES 
(
    '211000', -- student_id
    100003,   -- create_by
    'Viêm dạ dày cấp',
    '2025-06-10',
    NULL,
    '2025-06-11',
    'Cần gửi thuốc sớm',
    ARRAY['https://luatduonggia.vn/wp-content/uploads/2025/06/quy-dinh-ve-noi-dung-ke-don-thuoc1.jpg', 'https://cdn.lawnet.vn//uploads/NewsThumbnail/2019/02/26/0852441417662920-thuc-pham-chuc-nang.jpg'],
    'PROCESSING'
),
(
    '211002',
    100000,
    'TVCĐ',
    '2025-06-09',
    '2025-06-10',
    '2025-06-11',
    'Nhà trường giúp cháu uống thuốc đúng giờ',
    ARRAY['https://cdn.lawnet.vn//uploads/NewsThumbnail/2019/02/26/0852441417662920-thuc-pham-chuc-nang.jpg'],
    'DONE'
),
(
    '211001',
    100002,
    'Nhiễm trùng hô hấp trên cấp/ăn kém',
    '2025-06-08',
    NULL,
    '2025-06-09',
    'Gia đình muốn gửi thêm thuốc',
    ARRAY['https://static.tuoitre.vn/tto/i/s626/2011/04/12/2FiN0VCC.jpg'],
    'CANCELLED'
);



CREATE TABLE RequestItem (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES SendDrugRequest(id),
    name VARCHAR(255),
    intake_template_time VARCHAR(255)[] NOT NULL,
    dosage_usage TEXT NOT NULL
);

INSERT INTO RequestItem (request_id, name, intake_template_time, dosage_usage) VALUES
(1, 'Amoxycilin 500mg (Upanmox)', ARRAY['Trước khi ăn sáng', 'Trước khi ăn tối'], 'mỗi lần 2 viên'),
(1, 'Metrodinazol 250mg/v', ARRAY['Trước khi ăn sáng', 'Trước khi ăn tối'], 'mỗi lần 2 viên'),
(2, 'Seotalac', ARRAY['Sau ăn trưa', 'Sau ăn tối'], 'mỗi lần 1 viên'),
(2, 'Độc hoạt TKS viên (Lọ/100v)', ARRAY['Sau ăn sáng', 'Sau ăn trưa', 'Sau ăn tối'], 'mỗi lần 3 viên'),
(2, 'Đại tần giao', ARRAY['Sau ăn sáng', 'Sau ăn trưa', 'Sau ăn tối'], 'mỗi lần 3 viên'),
(3, 'Bimoclar', ARRAY['Sau ăn sáng', 'Sau ăn trưa'], 'uống mỗi lần 8ml'),
(3, 'Rinofil', ARRAY['Sau ăn trưa'], 'uống mỗi lần 5ml');

--------------------------------------------------------------------------------------------------------------------------------End FLOW SEND MEDICATION REQUEST 

------------------------------------------------------------------------------------------------------------------------------------FLOW CHECKUP CAMPAIGN
----------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE TYPE campaign_status AS ENUM (
   'DRAFTED',
   'PREPARING',
    'UPCOMING',
    'CANCELLED',
    'DONE',
    'ONGOING'
);

CREATE TABLE CheckupCampaign (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE,
	end_date DATE,
    status campaign_status NOT NULL DEFAULT 'DRAFTED'
);

INSERT INTO CheckupCampaign (name, description, location, start_date, end_date, status) VALUES
('Khám sức khỏe định kỳ học sinh năm 2022', 'Chiến dịch khám sức khỏe tổng quát cho toàn bộ học sinh trong trường. Thời gian dự kiến: 8h sáng.', 'nhà đà năng tầng 4', '2022-08-01', '2022-08-02', 'DONE'),
('Khám sức khỏe định kỳ học sinh năm 2023', 'Chiến dịch khám sức khỏe tổng quát cho toàn bộ học sinh trong trường. Thời gian dự kiến: 8h sáng.', 'nhà đà năng tầng 4', '2023-8-05', '2023-08-06', 'DONE'),
('Khám sức khỏe định kỳ học sinh năm 2024', 'Chiến dịch khám sức khỏe tổng quát cho toàn bộ học sinh trong trường', 'nhà đà năng tầng 4', '2024-05-15', '2025-05-16', 'CANCELLED');
-- ('Khám sức khỏe định kỳ học sinh năm 2024', 'Chiến dịch khám sức khỏe tổng quát cho toàn bộ học sinh trong trường', 'nhà đà năng tầng 4', '2024-08-15', '2025-08-26', 'DONE');

CREATE TABLE SpecialistExamList (
	id serial primary key,
	name VARCHAR(100) NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
    description TEXT
);

INSERT INTO SpecialistExamList (name, description) VALUES
('Khám sinh dục', 'Đánh giá sức khỏe sinh dục, đặc biệt ở lứa tuổi dậy thì.'),
('Khám tâm lý', 'Tư vấn tâm lý học đường, hỗ trợ điều chỉnh cảm xúc, hành vi.'),
('Khám tâm thần', 'Phát hiện các rối loạn tâm thần, cần bác sĩ chuyên khoa can thiệp.'),
('Khám xâm lấn', 'Các thủ thuật có can thiệp trực tiếp vào cơ thể như lấy máu xét nghiệm, tiêm phòng, sinh thiết.');

CREATE TABLE CampaignContainSpeExam (
    campaign_id INT NOT NULL,
    specialist_exam_id INT NOT NULL,
    PRIMARY KEY (campaign_id, specialist_exam_id),
    FOREIGN KEY (campaign_id) REFERENCES CheckupCampaign(id) ON DELETE CASCADE,
    FOREIGN KEY (specialist_exam_id) REFERENCES SpecialistExamList(id) ON DELETE CASCADE
);

INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(1, 1), -- Khám sinh dục
(1, 3); -- Khám tâm thần


INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(2, 2); -- Khám tâm lý (ví dụ, hoặc bạn có thể thêm các chuyên khoa khác nếu có)


INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(3, 4);


CREATE TYPE register_status AS ENUM (
    'PENDING',
    'SUBMITTED',
    'CANCELLED'
);

CREATE TABLE CheckupRegister (
    id SERIAL PRIMARY KEY,
    campaign_id INT NOT NULL,
    student_id varchar(10) NOT NULL,
    submit_by int,
    submit_time TIMESTAMP,
    reason TEXT,
    status register_status NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (campaign_id) REFERENCES CheckupCampaign(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE,
    -- submit_by có thể là mẹ hoặc bố, nên FK không rõ ràng, bạn có thể không đặt FK hoặc tạo thêm bảng phụ huynh riêng
    -- nếu submit_by trỏ đến bảng Parent thì FK như sau:
    FOREIGN KEY (submit_by) REFERENCES Parent(id) ON DELETE CASCADE
);

---Campaign 1
-- 10 học sinh đã nộp
INSERT INTO CheckupRegister (campaign_id, student_id, submit_by, submit_time, status, reason) VALUES
(1, '211000', 100003, '2022-07-25 08:00:00', 'SUBMITTED', 'Đồng ý tham gia khám chuyên khoa'),
(1, '211001', 100003, '2022-07-26 08:00:00', 'SUBMITTED', 'Đồng ý'),
(1, '211002', 100000, '2022-07-25 08:00:00', 'SUBMITTED', 'Chấp nhận tham gia'),
(1, '211003', 100000, '2022-07-27 08:00:00', 'SUBMITTED', 'Đồng ý tham gia khám chuyên khoa'),
(1, '211004', 100005, '2022-07-28 08:00:00', 'SUBMITTED', 'Đồng ý'),
(1, '211005', 100007, '2022-07-25 08:00:00', 'SUBMITTED', 'Chấp nhận tham gia'),
(1, '211006', 100009, '2022-07-27 08:00:00', 'SUBMITTED', 'Đồng ý tham gia khám chuyên khoa'),
(1, '211007', 100011, '2022-07-28 08:00:00', 'SUBMITTED', 'Đồng ý'),
(1, '211008', 100013, '2022-07-29 08:00:00', 'SUBMITTED', 'Chấp nhận tham gia'),
(1, '211009', 100015, '2022-07-30 08:00:00', 'SUBMITTED', 'Đồng ý tham gia khám chuyên khoa');


-- 24 học sinh chưa nộp (PENDING)
INSERT INTO CheckupRegister (campaign_id, student_id, status) VALUES
(1, '211010', 'PENDING'),
(1, '211011', 'PENDING'),
(1, '211012', 'PENDING'),
(1, '211013', 'PENDING'),
(1, '211014', 'PENDING'),
(1, '211015', 'PENDING'),
(1, '211016', 'PENDING'),
(1, '211017', 'PENDING'),
(1, '211018', 'PENDING'),
(1, '211019', 'PENDING'),
(1, '211020', 'PENDING'),
(1, '211021', 'PENDING'),
(1, '211022', 'PENDING'),
(1, '211023', 'PENDING'),
(1, '211024', 'PENDING'),
(1, '211025', 'PENDING'),
(1, '211026', 'PENDING'),
(1, '211027', 'PENDING'),
(1, '211028', 'PENDING'),
(1, '211029', 'PENDING'),
(1, '211030', 'PENDING'),
(1, '211031', 'PENDING'),
(1, '211032', 'PENDING'),
(1, '211033', 'PENDING');

---Campaign 2
-- 24 bản ghi đầu: status = PENDING (mặc định)
INSERT INTO CheckupRegister (campaign_id, student_id)
VALUES
(2, '211000'),
(2, '211001'),
(2, '211002'),
(2, '211003'),
(2, '211004'),
(2, '211005'),
(2, '211006'),
(2, '211007'),
(2, '211008'),
(2, '211009'),
(2, '211010'),
(2, '211011'),
(2, '211012'),
(2, '211013'),
(2, '211014'),
(2, '211015'),
(2, '211016'),
(2, '211017'),
(2, '211018'),
(2, '211019'),
(2, '211020'),
(2, '211021'),
(2, '211022'),
(2, '211023');

-- 10 bản ghi cuối: status = SUBMITTED, submit_by = 1, submit_time từ 2023-06-01 đến 2023-06-07
INSERT INTO CheckupRegister (campaign_id, student_id, status, submit_by, submit_time, reason)
VALUES
(2, '211024', 'SUBMITTED', 100015, '2023-06-01 10:00:00', 'Đồng ý tham gia khám chuyên khoa'),
(2, '211025', 'SUBMITTED', 100017, '2023-06-02 11:15:00', 'Đồng ý'),
(2, '211026', 'SUBMITTED', 100019, '2023-06-02 14:30:00', 'Chấp nhận tham gia'),
(2, '211027', 'SUBMITTED', 100020, '2023-06-03 09:00:00', 'Đồng ý tham gia khám chuyên khoa'),
(2, '211028', 'SUBMITTED', 100023, '2023-06-04 08:45:00', 'Đồng ý'),
(2, '211029', 'SUBMITTED', 100024, '2023-06-04 15:10:00', 'Chấp nhận tham gia'),
(2, '211030', 'SUBMITTED', 100026, '2023-06-05 12:00:00', 'Đồng ý tham gia khám chuyên khoa'),
(2, '211031', 'SUBMITTED', 100028, '2023-06-06 13:30:00', 'Đồng ý'),
(2, '211032', 'SUBMITTED', 100030, '2023-06-06 16:45:00', 'Chấp nhận tham gia'),
(2, '211033', 'SUBMITTED', 100033, '2023-06-07 10:20:00', 'Đồng ý tham gia khám chuyên khoa');



create type health_record_status as enum ('CANCELLED','WAITING', 'DONE');
CREATE TABLE HealthRecord (
    id SERIAL PRIMARY KEY,
    register_id INT UNIQUE REFERENCES CheckupRegister(id) ON DELETE CASCADE,

    height VARCHAR(10),
    weight VARCHAR(10),
    blood_pressure VARCHAR(20),
    left_eye VARCHAR(10),
    right_eye VARCHAR(10),
    ear VARCHAR(50),
    nose VARCHAR(50),
    throat VARCHAR(50),
    teeth VARCHAR(50),
    gums VARCHAR(50),
    skin_condition VARCHAR(100),
    heart VARCHAR(100),
    lungs VARCHAR(100),
    spine VARCHAR(100),
    posture VARCHAR(100),
    record_url text DEFAULT NULL,
    final_diagnosis TEXT,
	date_record TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	is_checked BOOLEAN DEFAULT FALSE,
	status health_record_status NOT NULL DEFAULT 'WAITING'
);
---Campaign 1
INSERT INTO HealthRecord (
    register_id, height, weight, blood_pressure, left_eye, right_eye,
    ear, nose, throat, teeth, gums, skin_condition,
    heart, lungs, spine, posture,
    record_url, final_diagnosis, is_checked, status, date_record
) VALUES
(1, '145', '38', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Cong nhẹ', 'Hơi lệch', NULL, 'Thiếu cân, cận nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(2, '150', '43', '110/70', '10/10', '10/10', 'Bình thường', 'Viêm nhẹ', 'Ổn định', 'Không sâu', 'Bình thường', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Bình thường', true, 'DONE', '2022-08-02 08:00:00'),
(3, '155', '48', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi đỏ', 'Không sâu', 'Bình thường', 'Không bệnh ngoài da', 'Bình thường', 'Tốt', 'Thẳng', 'Hơi lệch', NULL, 'Họng đỏ nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(4, '148', '40', '100/65', '10/10', '9/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Bình thường', 'Thẳng', 'Bình thường', NULL, 'Thị lực giảm nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(5, '160', '52', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi khò khè', 'Không sâu', 'Tốt', 'Bình thường', 'Bình thường', 'Khò nhẹ', 'Thẳng', 'Bình thường', NULL, 'Khò nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(6, '142', '36', '90/60', '9/10', '9/10', 'Viêm tai', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da khô', 'Bình thường', 'Tốt', 'Thẳng', 'Lệch vai', NULL, 'Viêm tai giữa nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(7, '163', '58', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Khỏe mạnh', true, 'DONE', '2022-08-02 08:00:00'),
(8, '155', '65', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Viêm nhẹ', 'Sâu nặng', 'Viêm lợi', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Cong nặng', 'Lệch hông', NULL, 'Cần điều trị răng miệng', true, 'DONE', '2022-08-02 08:00:00'),
(9, '158', '46', '100/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da bình thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Khỏe mạnh', true, 'DONE', '2022-08-02 08:00:00'),
(10, '150', '35', '100/60', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Bình thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Hơi gầy', true, 'DONE', '2022-08-02 08:00:00'),
(11, '165', '70', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thừa cân nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(12, '153', '44', '110/70', '10/10', '10/10', 'Viêm tai', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Lệch nhẹ', NULL, 'Cần theo dõi tai', true, 'DONE', '2022-08-02 08:00:00'),
(13, '160', '50', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Viêm lợi nhẹ', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Hơi gù', NULL, 'Cần đánh răng đều', true, 'DONE', '2022-08-02 08:00:00'),
(14, '149', '41', '100/65', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da mẫn cảm', 'Tốt', 'Tốt', 'Cong nhẹ', 'Lệch nhẹ', NULL, 'Viêm da dị ứng', true, 'DONE', '2022-08-02 08:00:00'),
(15, '152', '55', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Bình thường', true, 'DONE', '2022-08-02 08:00:00'),
(16, '145', '38', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Cong nhẹ', 'Hơi lệch', NULL, 'Thiếu cân, cận nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(17, '150', '43', '110/70', '10/10', '10/10', 'Bình thường', 'Viêm nhẹ', 'Ổn định', 'Không sâu', 'Bình thường', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Bình thường', true, 'DONE', '2022-08-02 08:00:00'),
(18, '155', '48', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi đỏ', 'Không sâu', 'Bình thường', 'Không bệnh ngoài da', 'Bình thường', 'Tốt', 'Thẳng', 'Hơi lệch', NULL, 'Họng đỏ nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(19, '148', '40', '100/65', '10/10', '9/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Bình thường', 'Thẳng', 'Bình thường', NULL, 'Thị lực giảm nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(20, '160', '52', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi khò khè', 'Không sâu', 'Tốt', 'Bình thường', 'Bình thường', 'Khò nhẹ', 'Thẳng', 'Bình thường', NULL, 'Khò nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(21, '142', '36', '90/60', '9/10', '9/10', 'Viêm tai', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da khô', 'Bình thường', 'Tốt', 'Thẳng', 'Lệch vai', NULL, 'Viêm tai giữa nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(22, '163', '58', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Khỏe mạnh', true, 'DONE', '2022-08-02 08:00:00'),
(23, '155', '65', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Viêm nhẹ', 'Sâu nặng', 'Viêm lợi', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Cong nặng', 'Lệch hông', NULL, 'Cần điều trị răng miệng', true, 'DONE', '2022-08-02 08:00:00'),
(24, '158', '46', '100/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da bình thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Khỏe mạnh', true, 'DONE', '2022-08-02 08:00:00'),
(25, '150', '35', '100/60', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Bình thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Hơi gầy', true, 'DONE', '2022-08-02 08:00:00'),
(26, '165', '70', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thừa cân nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(27, '153', '44', '110/70', '10/10', '10/10', 'Viêm tai', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Lệch nhẹ', NULL, 'Cần theo dõi tai', true, 'DONE', '2022-08-02 08:00:00'),
(28, '160', '50', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Viêm lợi nhẹ', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Hơi gù', NULL, 'Cần đánh răng đều', true, 'DONE', '2022-08-02 08:00:00'),
(29, '149', '41', '100/65', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da mẫn cảm', 'Tốt', 'Tốt', 'Cong nhẹ', 'Lệch nhẹ', NULL, 'Viêm da dị ứng', true, 'DONE', '2022-08-02 08:00:00'),
(30, '165', '70', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thừa cân nhẹ', true, 'DONE', '2022-08-02 08:00:00'),
(31, '153', '44', '110/70', '10/10', '10/10', 'Viêm tai', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Lệch nhẹ', NULL, 'Cần theo dõi tai', true, 'DONE', '2022-08-02 08:00:00'),
(32, '160', '50', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Viêm lợi nhẹ', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Hơi gù', NULL, 'Cần đánh răng đều', true, 'DONE', '2022-08-02 08:00:00'),
(33, '153', '44', '110/70', '10/10', '10/10', 'Viêm tai', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Thẳng', 'Lệch nhẹ', NULL, 'Cần theo dõi tai', true, 'DONE', '2022-08-02 08:00:00'),
(34, '160', '50', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Viêm lợi nhẹ', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Hơi gù', NULL, 'Cần đánh răng đều', true, 'DONE', '2022-08-02 08:00:00');


---Campaign 2
INSERT INTO HealthRecord (
    register_id, height, weight, blood_pressure, left_eye, right_eye,
    ear, nose, throat, teeth, gums, skin_condition,
    heart, lungs, spine, posture,
    record_url, final_diagnosis, is_checked, status, date_record
) VALUES
(35, '146', '39', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thiếu cân nhẹ', true, 'DONE', '2023-08-06'),
(36, '151', '45', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', 'https://example.com/record36.pdf', 'Bình thường', true, 'DONE', '2023-08-06'),
(37, '156', '49', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi đỏ', 'Không sâu', 'Tốt', 'Da thường',
 'Tốt', 'Tốt', 'Thẳng', 'Hơi lệch', NULL, 'Viêm họng nhẹ', true, 'DONE', '2023-08-06'),
(38, '149', '41', '100/65', '10/10', '9/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Da bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thị lực phải yếu nhẹ', true, 'DONE', '2023-08-06'),
(39, '161', '53', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi khò khè', 'Không sâu', 'Tốt', 'Bình thường',
 'Bình thường', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Hô hấp nhẹ', true, 'DONE', '2023-08-06'),
(40, '143', '35', '90/60', '9/10', '9/10', 'Viêm tai nhẹ', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da khô',
 'Tốt', 'Tốt', 'Thẳng', 'Lệch vai nhẹ', 'https://example.com/record40.pdf', 'Viêm tai giữa nhẹ', true, 'DONE', '2023-08-06'),
(41, '164', '59', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Khỏe mạnh', true, 'DONE', '2023-08-06'),
(42, '156', '66', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Viêm nhẹ', 'Sâu nặng', 'Viêm lợi',
 'Da khô', 'Tốt', 'Tốt', 'Cong nặng', 'Lệch hông', NULL, 'Cần điều trị răng lợi', true, 'DONE', '2023-08-06'),
(43, '159', '47', '100/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Bình thường', true, 'DONE', '2023-08-06'),
(44, '152', '36', '100/60', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', 'https://example.com/record44.pdf', 'Hơi gầy', true, 'DONE', '2023-08-06'),
(45, '167', '72', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Da bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thừa cân nhẹ', true, 'DONE', '2023-08-06'),
 (46, '155', '43', '110/70', '10/10', '10/10', 'Viêm tai nhẹ', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da khô',
 'Tốt', 'Tốt', 'Thẳng', 'Lệch nhẹ', NULL, 'Theo dõi tai', true, 'DONE', '2023-08-06'),
(47, '162', '51', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Viêm lợi nhẹ',
 'Da thường', 'Tốt', 'Tốt', 'Thẳng', 'Hơi gù', 'https://example.com/record47.pdf', 'Chăm sóc răng lợi', true, 'DONE', '2023-08-06'),
(48, '150', '42', '100/65', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da hơi nhạy',
 'Tốt', 'Tốt', 'Cong nhẹ', 'Lệch nhẹ', NULL, 'Viêm da nhẹ', true, 'DONE', '2023-08-06'),
(49, '153', '54', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Bình thường', true, 'DONE', '2023-08-06'),
(50, '146', '38', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Da thường',
 'Tốt', 'Tốt', 'Cong nhẹ', 'Hơi lệch', NULL, 'Cần theo dõi tư thế', true, 'DONE', '2023-08-06'),
(51, '151', '47', '110/70', '10/10', '10/10', 'Viêm tai nhẹ', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Da bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Lệch nhẹ', NULL, 'Nên tái khám tai', true, 'DONE', '2023-08-06'),
(52, '158', '49', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', 'https://example.com/record52.pdf', 'Bình thường', true, 'DONE', '2023-08-06'),
(53, '150', '35', '100/60', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi đỏ', 'Không sâu', 'Tốt', 'Bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Họng đỏ nhẹ', true, 'DONE', '2023-08-06'),
(54, '165', '71', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Tốt', 'Da thường',
 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thừa cân nhẹ', true, 'DONE', '2023-08-06'),
(55, '153', '44', '110/70', '10/10', '10/10', 'Viêm tai', 'Không viêm', 'Ổn định', 'Không sâu', 'Tốt', 'Bình thường',
 'Tốt', 'Tốt', 'Thẳng', 'Lệch nhẹ', NULL, 'Cần theo dõi tai', true, 'DONE', '2023-08-06'),
(56, '160', '49', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định', 'Sâu nhẹ', 'Viêm lợi nhẹ', 'Da khô',
 'Tốt', 'Tốt', 'Thẳng', 'Hơi gù', NULL, 'Đánh răng đều', true, 'DONE', '2023-08-06'),
 (57, '149', '40', '100/65', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định',
 'Không sâu', 'Tốt', 'Da mẫn cảm', 'Tốt', 'Tốt', 'Cong nhẹ', 'Lệch nhẹ', NULL, 'Viêm da dị ứng', true, 'DONE', '2023-08-06'),
(58, '154', '56', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định',
 'Không sâu', 'Tốt', 'Da thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Bình thường', true, 'DONE', '2023-08-06'),
(59, '147', '39', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định',
 'Sâu nhẹ', 'Tốt', 'Da thường', 'Tốt', 'Tốt', 'Cong nhẹ', 'Hơi lệch', NULL, 'Thiếu cân, cận nhẹ', true, 'DONE', '2023-08-06'),
(60, '152', '44', '110/70', '10/10', '10/10', 'Bình thường', 'Viêm nhẹ', 'Ổn định',
 'Không sâu', 'Bình thường', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', 'https://example.com/record60.pdf', 'Cần theo dõi viêm mũi', true, 'DONE', '2023-08-06'),
(61, '157', '49', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi đỏ',
 'Không sâu', 'Bình thường', 'Bình thường', 'Tốt', 'Tốt', 'Thẳng', 'Hơi lệch', NULL, 'Viêm họng nhẹ', true, 'DONE', '2023-08-06'),
(62, '150', '40', '100/65', '10/10', '9/10', 'Bình thường', 'Không viêm', 'Ổn định',
 'Sâu nhẹ', 'Tốt', 'Da thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Thị lực phải giảm nhẹ', true, 'DONE', '2023-08-06'),
(63, '162', '54', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi khò khè',
 'Không sâu', 'Tốt', 'Da thường', 'Tốt', 'Khò nhẹ', 'Thẳng', 'Bình thường', NULL, 'Cần theo dõi hô hấp', true, 'DONE', '2023-08-06'),
(64, '144', '37', '90/60', '9/10', '9/10', 'Viêm tai nhẹ', 'Không viêm', 'Ổn định',
 'Không sâu', 'Tốt', 'Da khô', 'Tốt', 'Tốt', 'Thẳng', 'Lệch vai nhẹ', NULL, 'Viêm tai giữa nhẹ', true, 'DONE', '2023-08-06'),
(65, '166', '59', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định',
 'Không sâu', 'Tốt', 'Da thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', 'https://example.com/record65.pdf', 'Khỏe mạnh', true, 'DONE', '2023-08-06'),
(66, '158', '64', '120/80', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Viêm nhẹ',
 'Sâu nặng', 'Viêm lợi', 'Không bệnh ngoài da', 'Tốt', 'Tốt', 'Cong nặng', 'Lệch hông', NULL, 'Cần điều trị răng miệng', true, 'DONE', '2023-08-06'),
(67, '160', '46', '100/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định',
 'Không sâu', 'Tốt', 'Da bình thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Khỏe mạnh', true, 'DONE', '2023-08-06'),
(68, '153', '42', '100/60', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Ổn định',
 'Không sâu', 'Tốt', 'Bình thường', 'Tốt', 'Tốt', 'Thẳng', 'Bình thường', NULL, 'Hơi gầy', true, 'DONE', '2023-08-06');

CREATE TYPE specialist_exam_record_status AS ENUM ('CANNOT_ATTACH', 'WAITING', 'DONE');
CREATE TABLE specialistExamRecord (
    register_id INT NOT NULL,
    spe_exam_id INT NOT NULL,
    result TEXT,
    diagnosis TEXT,
    diagnosis_paper_urls TEXT[],
    is_checked BOOLEAN DEFAULT FALSE,
    dr_name VARCHAR(255) DEFAULT null,
    date_record TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status specialist_exam_record_status NOT NULL DEFAULT 'CANNOT_ATTACH',
    PRIMARY KEY (register_id, spe_exam_id),
    FOREIGN KEY (register_id) REFERENCES CheckupRegister(id),
    FOREIGN KEY (spe_exam_id) REFERENCES SpecialistExamList(id)
);

INSERT INTO specialistExamRecord (
    register_id, spe_exam_id, result, diagnosis, diagnosis_paper_urls, is_checked, dr_name, status, date_record
)
VALUES
(1, 1, 'Không phát hiện bất thường sinh dục.', 'Sinh dục bình thường.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_000.jpg'], TRUE, 'BS. Nguyễn Văn An', 'DONE', '2025-07-10 08:00:00'),
(1, 3, 'Không có dấu hiệu rối loạn tâm thần.', 'Tâm thần ổn định.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_000_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_000_2.jpg'
], TRUE, 'BS. Trần Thị Bích', 'DONE', '2025-07-10 08:05:00'),

(2, 1, 'Cơ quan sinh dục phát triển bình thường.', 'Không phát hiện dị tật.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_001.jpg'], TRUE, 'BS. Lê Minh Tuấn', 'DONE', '2025-07-10 08:10:00'),
(2, 3, 'Ứng xử phù hợp, không có dấu hiệu loạn thần.', 'Tâm thần trong giới hạn bình thường.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_001_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_001_2.jpg'
], TRUE, 'BS. Phạm Thị Hồng', 'DONE', '2025-07-10 08:15:00'),

(3, 1, 'Không có dấu hiệu bất thường bộ phận sinh dục.', 'Sinh dục ổn định.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_002.jpg'], TRUE, 'BS. Đỗ Văn Cường', 'DONE', '2025-07-10 08:20:00'),
(3, 3, 'Tâm trạng ổn định, không có hành vi bất thường.', 'Không phát hiện rối loạn tâm thần.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_002_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_002_2.jpg'
], TRUE, 'BS. Nguyễn Thị Mai', 'DONE', '2025-07-10 08:25:00'),

(4, 1, 'Kiểm tra sinh dục trong giới hạn bình thường.', 'Không có dấu hiệu bệnh lý.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_003.jpg'], TRUE, 'BS. Vũ Hoàng Nam', 'DONE', '2025-07-10 08:30:00'),
(4, 3, 'Không có dấu hiệu stress hay lo âu kéo dài.', 'Tâm lý ổn định.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_003_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_003_2.jpg'
], TRUE, 'BS. Lê Thị Thảo', 'DONE', '2025-07-10 08:35:00'),

(5, 1, 'Sinh dục không bị tổn thương.', 'Không phát hiện bất thường.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_004.jpg'], TRUE, 'BS. Trịnh Văn Hùng', 'DONE', '2025-07-10 08:40:00'),
(5, 3, 'Phản ứng cảm xúc phù hợp, giao tiếp tốt.', 'Tâm thần bình thường.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_004_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_004_2.jpg'
], TRUE, 'BS. Bùi Thị Lan', 'DONE', '2025-07-10 08:45:00'),

(6, 1, 'Bộ phận sinh dục phát triển theo độ tuổi.', 'Không có dấu hiệu bệnh lý.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_005.jpg'], TRUE, 'BS. Hồ Ngọc Hà', 'DONE', '2025-07-10 08:50:00'),
(6, 3, 'Nhận thức rõ ràng, trả lời câu hỏi phù hợp.', 'Tâm thần khỏe mạnh.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_005_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_005_2.jpg'
], TRUE, 'BS. Nguyễn Quốc Huy', 'DONE', '2025-07-10 08:55:00'),

(7, 1, 'Không phát hiện viêm nhiễm hoặc dị tật.', 'Khám sinh dục bình thường.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_006.jpg'], TRUE, 'BS. Đinh Thị Yến', 'DONE', '2025-07-10 09:00:00'),
(7, 3, 'Không có dấu hiệu rối loạn tâm trạng.', 'Tâm thần bình thường.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_006_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_006_2.jpg'
], TRUE, 'BS. Võ Minh Tâm', 'DONE', '2025-07-10 09:05:00'),

(8, 1, 'Sinh dục trong trạng thái khỏe mạnh.', 'Không có biểu hiện lâm sàng bất thường.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_007.jpg'], TRUE, 'BS. Hà Văn Quang', 'DONE', '2025-07-10 09:10:00'),
(8, 3, 'Không phát hiện bất ổn tâm lý.', 'Khám tâm thần trong giới hạn bình thường.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_007_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_007_2.jpg'
], TRUE, 'BS. Lý Thị Hạnh', 'DONE', '2025-07-10 09:15:00'),

(9, 1, 'Khám sinh dục không phát hiện bất thường.', 'Tình trạng sinh dục ổn định.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_008.jpg'], TRUE, 'BS. Nguyễn Hữu Tài', 'DONE', '2025-07-10 09:20:00'),
(9, 3, 'Tâm thần tỉnh táo, phản xạ nhanh.', 'Tâm thần tốt.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_008_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_000_1.jpg'
], TRUE, 'BS. Phan Thị Diễm', 'DONE', '2025-07-10 09:25:00'),

(10, 1, 'Không có dấu hiệu nhiễm trùng hay tổn thương.', 'Sinh dục trong giới hạn bình thường.', ARRAY['https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/sinh-duc/sd_009.jpg'], TRUE, 'BS. Tô Văn Khánh', 'DONE', '2025-07-10 09:30:00'),
(10, 3, 'Thái độ hợp tác tốt, không rối loạn hành vi.', 'Khám tâm thần bình thường.', 
ARRAY[
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_009_1.jpg',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/special-health-record/tam-than/tt_009_2.jpg'
], TRUE, 'BS. Trương Thị Thu', 'DONE', '2025-07-10 09:35:00');



----- FLOW VACCINATION CAMPAIGN
--disease
CREATE TABLE disease (
    id SERIAL PRIMARY KEY,
    disease_category TEXT CHECK (disease_category IN ('Bệnh mãn tính', 'Bệnh truyền nhiễm')),
    name TEXT NOT NULL,
    description TEXT,
    vaccine_need BOOLEAN,
    dose_quantity INT,
    CHECK (disease_category IN ('Bệnh truyền nhiễm', 'Bệnh mãn tính'))
);


-- Insert data into disease table
INSERT INTO disease (disease_category, name, description, vaccine_need) VALUES
-- Bệnh truyền nhiễm (giữ nguyên từ dữ liệu trước)
('Bệnh truyền nhiễm', 'Bạch hầu', 'Bệnh do vi khuẩn Corynebacterium diphtheriae gây ra, ảnh hưởng đến đường hô hấp', TRUE),
('Bệnh truyền nhiễm', 'Ho gà', 'Bệnh do vi khuẩn Bordetella pertussis gây ra, gây ho kéo dài', TRUE),
('Bệnh truyền nhiễm', 'Uốn ván', 'Bệnh do vi khuẩn Clostridium tetani gây ra, gây co cơ và co giật', TRUE),
('Bệnh truyền nhiễm', 'Bại liệt', 'Bệnh do virus polio gây ra, có thể gây liệt', TRUE),
('Bệnh truyền nhiễm', 'Viêm màng não mủ', 'Bệnh do vi khuẩn Haemophilus influenzae type b (Hib) hoặc não mô cầu gây ra', TRUE),
('Bệnh truyền nhiễm', 'Viêm phổi do Hib', 'Viêm phổi do vi khuẩn Haemophilus influenzae type b', TRUE),
('Bệnh truyền nhiễm', 'Viêm gan B', 'Bệnh do virus viêm gan B gây ra, ảnh hưởng đến gan', TRUE),
('Bệnh truyền nhiễm', 'Tiêu chảy cấp do Rota virus', 'Bệnh tiêu hóa do virus Rota gây ra, phổ biến ở trẻ em', TRUE),
('Bệnh truyền nhiễm', 'Các bệnh do phế cầu', 'Bệnh do vi khuẩn Streptococcus pneumoniae gây ra, bao gồm viêm phổi, viêm màng não', TRUE),
('Bệnh truyền nhiễm', 'Lao', 'Bệnh do vi khuẩn Mycobacterium tuberculosis gây ra, ảnh hưởng đến phổi', TRUE),
('Bệnh truyền nhiễm', 'Viêm màng não do não mô cầu', 'Bệnh do vi khuẩn Neisseria meningitidis gây ra', TRUE),
('Bệnh truyền nhiễm', 'Sởi', 'Bệnh do virus sởi gây ra, gây sốt và phát ban', TRUE),
('Bệnh truyền nhiễm', 'Quai bị', 'Bệnh do virus quai bị gây ra, gây sưng tuyến nước bọt', TRUE),
('Bệnh truyền nhiễm', 'Rubella', 'Bệnh do virus Rubella gây ra, gây phát ban và nguy hiểm cho thai nhi', TRUE),
('Bệnh truyền nhiễm', 'Thủy đậu', 'Bệnh do virus Varicella-zoster gây ra, gây phát ban và ngứa', TRUE),
('Bệnh truyền nhiễm', 'Zona thần kinh', 'Bệnh do virus Varicella-zoster tái hoạt động, gây đau và phát ban', TRUE),
('Bệnh truyền nhiễm', 'Cúm', 'Bệnh do virus cúm gây ra, ảnh hưởng đến đường hô hấp', TRUE),
('Bệnh mãn tính', 'Ung thư cổ tử cung do HPV', 'Ung thư do virus HPV gây ra, ảnh hưởng đến cổ tử cung', TRUE),
('Bệnh mãn tính', 'Ung thư hầu họng do HPV', 'Ung thư do virus HPV gây ra, ảnh hưởng đến hầu họng', TRUE),
('Bệnh mãn tính', 'Sùi mào gà do HPV', 'Bệnh do virus HPV gây ra, gây u nhú ở da và niêm mạc', TRUE),
('Bệnh truyền nhiễm', 'Sốt xuất huyết', 'Bệnh do virus Dengue gây ra, gây sốt cao và xuất huyết', TRUE),
('Bệnh truyền nhiễm', 'Viêm não Nhật Bản', 'Bệnh do virus viêm não Nhật Bản gây ra, ảnh hưởng đến não', TRUE),
('Bệnh truyền nhiễm', 'Dại', 'Bệnh do virus dại gây ra, gây tử vong nếu không điều trị', TRUE),
('Bệnh truyền nhiễm', 'Viêm gan A', 'Bệnh do virus viêm gan A gây ra, ảnh hưởng đến gan', TRUE),
('Bệnh truyền nhiễm', 'Thương hàn', 'Bệnh do vi khuẩn Salmonella Typhi gây ra, ảnh hưởng đến đường tiêu hóa', TRUE),
('Bệnh truyền nhiễm', 'Tả', 'Bệnh do vi khuẩn Vibrio cholerae gây ra, gây tiêu chảy cấp', TRUE),
('Bệnh truyền nhiễm', 'Sốt vàng', 'Bệnh do virus sốt vàng gây ra, ảnh hưởng đến gan và thận', TRUE),
-- Bệnh mãn tính (bổ sung thêm)
('Bệnh mãn tính', 'Tiểu đường type 1', 'Bệnh tự miễn làm tổn thương tế bào sản xuất insulin trong tuyến tụy', FALSE),
('Bệnh mãn tính', 'Tiểu đường type 2', 'Bệnh liên quan đến kháng insulin, thường gặp ở người lớn tuổi hoặc thừa cân', FALSE),
('Bệnh mãn tính', 'Tăng huyết áp', 'Tình trạng huyết áp cao kéo dài, gây nguy cơ đột quỵ và bệnh tim', FALSE),
('Bệnh mãn tính', 'Bệnh tim mạch', 'Các bệnh liên quan đến tim và mạch máu, bao gồm suy tim, nhồi máu cơ tim', FALSE),
('Bệnh mãn tính', 'Suy thận mạn', 'Suy giảm chức năng thận kéo dài, có thể dẫn đến dialysis', FALSE),
('Bệnh mãn tính', 'Viêm gan mạn tính không do virus', 'Viêm gan kéo dài do rượu, béo phì hoặc tự miễn, không do virus', FALSE),
('Bệnh mãn tính', 'Bệnh phổi tắc nghẽn mạn tính (COPD)', 'Bệnh phổi gây khó thở do tổn thương phế nang, thường do hút thuốc', FALSE),
('Bệnh mãn tính', 'Hen suyễn', 'Bệnh phổi mạn tính gây co thắt đường thở, dẫn đến khó thở', FALSE),
('Bệnh mãn tính', 'Viêm khớp dạng thấp', 'Bệnh tự miễn gây viêm và đau khớp kéo dài', FALSE),
('Bệnh mãn tính', 'Lupus ban đỏ hệ thống', 'Bệnh tự miễn ảnh hưởng đến nhiều cơ quan như da, khớp, thận', FALSE),
('Bệnh mãn tính', 'Ung thư phổi', 'Ung thư phát triển từ tế bào phổi, thường liên quan đến hút thuốc', FALSE),
('Bệnh mãn tính', 'Ung thư gan', 'Ung thư phát triển từ tế bào gan, thường liên quan đến viêm gan mạn hoặc xơ gan', FALSE),
('Bệnh mãn tính', 'Ung thư vú', 'Ung thư phát triển từ tế bào vú, phổ biến ở phụ nữ', FALSE),
('Bệnh mãn tính', 'Ung thư đại trực tràng', 'Ung thư phát triển từ đại tràng hoặc trực tràng', FALSE),
('Bệnh mãn tính', 'Bệnh Parkinson', 'Rối loạn thần kinh tiến triển gây run, cứng cơ và khó vận động', FALSE),
('Bệnh mãn tính', 'Bệnh Alzheimer', 'Bệnh thoái hóa thần kinh gây suy giảm trí nhớ và nhận thức', FALSE),
('Bệnh mãn tính', 'Loãng xương', 'Tình trạng xương mất mật độ, dễ gãy, thường gặp ở người lớn tuổi', FALSE),
('Bệnh mãn tính', 'Viêm loét dạ dày mạn tính', 'Viêm loét kéo dài ở niêm mạc dạ dày, thường do vi khuẩn HP hoặc stress', FALSE),
('Bệnh mãn tính', 'Bệnh gout', 'Bệnh do tích tụ axit uric gây viêm khớp, thường ở ngón chân cái', FALSE),
('Bệnh mãn tính', 'Động kinh', 'Rối loạn thần kinh gây co giật tái phát', FALSE),
('Bệnh mãn tính', 'Bệnh vảy nến', 'Bệnh tự miễn gây tổn thương da với các mảng đỏ, bong tróc', FALSE),
('Bệnh mãn tính', 'Bệnh Crohn', 'Bệnh viêm ruột mạn tính, ảnh hưởng đến đường tiêu hóa', FALSE),
('Bệnh mãn tính', 'Viêm đại tràng mạn tính', 'Viêm kéo dài ở đại tràng, gây tiêu chảy và đau bụng', FALSE),
('Bệnh mãn tính', 'Xơ gan', 'Tổn thương gan mạn tính do rượu, viêm gan hoặc các nguyên nhân khác', FALSE),
('Bệnh mãn tính', 'Suy giáp', 'Tuyến giáp hoạt động kém, gây mệt mỏi và tăng cân', FALSE),
('Bệnh mãn tính', 'Cường giáp', 'Tuyến giáp hoạt động quá mức, gây giảm cân và tim đập nhanh', FALSE);


--vaccine
CREATE TABLE vaccine (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    origin VARCHAR(100),
    description TEXT
);

-- Insert data into vaccine table
INSERT INTO vaccine (name, origin, description) VALUES
('Infanrix Hexa (6in1)', 'Bỉ', 'Vắc xin 6 trong 1 phòng bạch hầu, ho gà, uốn ván, bại liệt, viêm màng não mủ, viêm phổi do Hib, viêm gan B'),
('Hexaxim (6in1)', 'Pháp', 'Vắc xin 6 trong 1 phòng bạch hầu, ho gà, uốn ván, bại liệt, viêm màng não mủ, viêm phổi do Hib, viêm gan B'),
('Rotateq', 'Mỹ', 'Vắc xin uống phòng tiêu chảy cấp do Rota virus'),
('Rotarix', 'Bỉ', 'Vắc xin uống phòng tiêu chảy cấp do Rota virus'),
('Rotavin', 'Việt Nam', 'Vắc xin uống phòng tiêu chảy cấp do Rota virus'),
('Synflorix', 'Bỉ', 'Vắc xin phòng các bệnh do phế cầu khuẩn'),
('Prevenar 13', 'Bỉ', 'Vắc xin phòng 13 chủng phế cầu khuẩn'),
('Vaxneuvance', 'Ireland', 'Vắc xin phòng các bệnh do phế cầu khuẩn'),
('Prevenar 20', 'Bỉ', 'Vắc xin phòng 20 chủng phế cầu khuẩn'),
('Pneumovax 23', 'Mỹ', 'Vắc xin phòng 23 chủng phế cầu khuẩn'),
('BCG (lọ 1ml)', 'Việt Nam', 'Vắc xin phòng bệnh lao'),
('Gene Hbvax 1ml', 'Việt Nam', 'Vắc xin viêm gan B cho người lớn'),
('Heberbiovac 1ml', 'Cu Ba', 'Vắc xin viêm gan B cho người lớn'),
('Gene Hbvax 0.5ml', 'Việt Nam', 'Vắc xin viêm gan B cho trẻ em'),
('Heberbiovac 0.5ml', 'Cu Ba', 'Vắc xin viêm gan B cho trẻ em'),
('Bexsero', 'Ý', 'Vắc xin phòng viêm màng não do não mô cầu nhóm B'),
('VA-Mengoc-BC', 'Cu Ba', 'Vắc xin phòng viêm màng não do não mô cầu nhóm B, C'),
('MenQuadfi', 'Mỹ', 'Vắc xin phòng viêm màng não do não mô cầu nhóm A, C, Y, W-135'),
('Menactra', 'Mỹ', 'Vắc xin phòng viêm màng não do não mô cầu nhóm A, C, Y, W-135'),
('MVVac (Lọ 5ml)', 'Việt Nam', 'Vắc xin phòng bệnh sởi'),
('MVVac (Liều 0.5ml)', 'Việt Nam', 'Vắc xin phòng bệnh sởi'),
('MMR II (3 in 1)', 'Mỹ', 'Vắc xin 3 trong 1 phòng sởi, quai bị, rubella'),
('Priorix', 'Bỉ', 'Vắc xin 3 trong 1 phòng sởi, quai bị, rubella'),
('Varivax', 'Mỹ', 'Vắc xin phòng thủy đậu'),
('Varilrix', 'Bỉ', 'Vắc xin phòng thủy đậu'),
('Shingrix', 'Bỉ', 'Vắc xin phòng zona thần kinh'),
('Vaxigrip Tetra 0.5ml', 'Pháp', 'Vắc xin phòng cúm 4 chủng'),
('Influvac Tetra 0.5ml', 'Hà Lan', 'Vắc xin phòng cúm 4 chủng'),
('GC Flu Quadrivalent', 'Hàn Quốc', 'Vắc xin phòng cúm 4 chủng'),
('Ivacflu-S', 'Việt Nam', 'Vắc xin phòng cúm'),
('Gardasil 0.5ml', 'Mỹ', 'Vắc xin phòng các bệnh do HPV 4 chủng'),
('Gardasil 9 0.5ml', 'Mỹ', 'Vắc xin phòng các bệnh do HPV 9 chủng'),
('Qdenga', 'Đức', 'Vắc xin phòng sốt xuất huyết'),
('Vắc xin uốn ván hấp phụ (TT)', 'Việt Nam', 'Vắc xin phòng uốn ván'),
('Huyết thanh uốn ván (SAT)', 'Việt Nam', 'Huyết thanh phòng uốn ván'),
('Imojev', 'Thái Lan', 'Vắc xin phòng viêm não Nhật Bản'),
('Jeev 3mcg/0.5ml', 'Ấn Độ', 'Vắc xin phòng viêm não Nhật Bản'),
('Jevax 1ml', 'Việt Nam', 'Vắc xin phòng viêm não Nhật Bản'),
('Verorab 0.5ml (TB)', 'Pháp', 'Vắc xin phòng dại tiêm bắp'),
('Verorab 0.5ml (TTD)', 'Pháp', 'Vắc xin phòng dại tiêm trong da'),
('Abhayrab 0.5ml (TB)', 'Ấn Độ', 'Vắc xin phòng dại tiêm bắp'),
('Abhayrab 0.5ml (TTD)', 'Ấn Độ', 'Vắc xin phòng dại tiêm trong da'),
('Adacel', 'Canada', 'Vắc xin phòng bạch hầu, ho gà, uốn ván'),
('Boostrix', 'Bỉ', 'Vắc xin phòng bạch hầu, ho gà, uốn ván'),
('Tetraxim', 'Pháp', 'Vắc xin 4 trong 1 phòng bạch hầu, ho gà, uốn ván, bại liệt'),
('Uốn ván, bạch hầu hấp phụ (Td) – Lọ 0.5ml', 'Việt Nam', 'Vắc xin phòng bạch hầu, uốn ván'),
('Uốn ván, bạch hầu hấp phụ (Td) - Liều', 'Việt Nam', 'Vắc xin phòng bạch hầu, uốn ván'),
('Twinrix', 'Bỉ', 'Vắc xin phòng viêm gan A và B'),
('Havax 0.5ml', 'Việt Nam', 'Vắc xin phòng viêm gan A'),
('Avaxim 80U', 'Pháp', 'Vắc xin phòng viêm gan A'),
('Typhoid VI', 'Việt Nam', 'Vắc xin phòng thương hàn'),
('Typhim VI', 'Pháp', 'Vắc xin phòng thương hàn'),
('Quimi-Hib', 'Cu Ba', 'Vắc xin phòng các bệnh do Hib'),
('Morcvax', 'Việt Nam', 'Vắc xin uống phòng tả'),
('Stamaril', 'Pháp', 'Vắc xin phòng sốt vàng');

CREATE TABLE vaccine_disease (
    vaccine_id INT PRIMARY KEY,
    disease_id INT[] NOT NULL,
    dose_quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (vaccine_id) REFERENCES vaccine(id)
);

-- Insert data into vaccine_disease table
INSERT INTO vaccine_disease (vaccine_id, disease_id, dose_quantity) VALUES
(1,  ARRAY[1,2,3,4,5,6,7], 3),         -- Infanrix Hexa
(2,  ARRAY[1,2,3,4,5,6,7], 3),         -- Hexaxim
(3,  ARRAY[8], 2),                     -- Rotateq
(4,  ARRAY[8], 2),                     -- Rotarix
(5,  ARRAY[8], 2),                     -- Rotavin
(6,  ARRAY[9], 3),                     -- Synflorix
(7,  ARRAY[9], 3),                     -- Prevenar 13
(8,  ARRAY[9], 3),                     -- Vaxneuvance
(9,  ARRAY[9], 3),                     -- Prevenar 20
(10, ARRAY[9], 3),                     -- Pneumovax 23
(11, ARRAY[10], 1),                    -- BCG
(12, ARRAY[7], 1),                     -- Gene Hbvax 1ml
(13, ARRAY[7], 1),                     -- Heberbiovac 1ml
(14, ARRAY[7], 1),                     -- Gene Hbvax 0.5ml
(15, ARRAY[7], 1),                     -- Heberbiovac 0.5ml
(16, ARRAY[11], 1),                    -- Bexsero
(17, ARRAY[11], 1),                    -- VA-Mengoc-BC
(18, ARRAY[11], 1),                    -- MenQuadfi
(19, ARRAY[11], 1),                    -- Menactra
(20, ARRAY[12], 1),                    -- MVVac (5ml)
(21, ARRAY[12], 1),                    -- MVVac (0.5ml)
(22, ARRAY[12,13,14], 1),              -- MMR II
(23, ARRAY[12,13,14], 1),              -- Priorix
(24, ARRAY[15], 1),                    -- Varivax
(25, ARRAY[15], 1),                    -- Varilrix
(26, ARRAY[16], 1),                    -- Shingrix
(27, ARRAY[17], 1),                    -- Vaxigrip Tetra
(28, ARRAY[17], 1),                    -- Influvac Tetra
(29, ARRAY[17], 1),                    -- GC Flu Quadrivalent
(30, ARRAY[17], 1),                    -- Ivacflu-S
(31, ARRAY[18,19,20], 1),              -- Gardasil
(32, ARRAY[18,19,20], 1),              -- Gardasil 9
(33, ARRAY[21], 1),                    -- Qdenga
(34, ARRAY[3], 1),                     -- Vắc xin uốn ván hấp phụ (TT)
(35, ARRAY[3], 1),                     -- Huyết thanh uốn ván (SAT)
(36, ARRAY[22], 1),                    -- Imojev
(37, ARRAY[22], 1),                    -- Jeev
(38, ARRAY[22], 1),                    -- Jevax
(39, ARRAY[23], 1),                    -- Verorab (TB)
(40, ARRAY[23], 1),                    -- Verorab (TTD)
(41, ARRAY[23], 1),                    -- Abhayrab (TB)
(42, ARRAY[23], 1),                    -- Abhayrab (TTD)
(43, ARRAY[1,2,3], 1),                 -- Adacel
(44, ARRAY[1,2,3], 1),                 -- Boostrix
(45, ARRAY[1,2,3,4], 1),               -- Tetraxim
(46, ARRAY[1,3], 1),                   -- Uốn ván, bạch hầu hấp phụ (Td) – Lọ
(47, ARRAY[1,3], 1),                   -- Uốn ván, bạch hầu hấp phụ (Td) – Liều
(48, ARRAY[7,24], 1),                  -- Twinrix
(49, ARRAY[24], 1),                    -- Havax
(50, ARRAY[24], 1),                    -- Avaxim 80U
(51, ARRAY[25], 1),                    -- Typhoid VI
(52, ARRAY[25], 1),                    -- Typhim VI
(53, ARRAY[5,6], 1),                   -- Quimi-Hib
(54, ARRAY[26], 1),                    -- Morcvax
(55, ARRAY[27], 1);                    -- Stamaril
       
--vaccination_campaign
CREATE TABLE vaccination_campaign (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
	  disease_id INT[] NOT NULL,
    vaccine_id INT NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('DRAFTED', 'PREPARING', 'UPCOMING', 'CANCELLED', 'ONGOING', 'COMPLETED')),
    FOREIGN KEY (vaccine_id) REFERENCES vaccine(id)
);

-- INSERT INTO vaccination_campaign (disease_id, vaccine_id, title, location, start_date, end_date, status) VALUES
-- (10, 11, 'Tiêm phòng bệnh lao (BCG), tiêm sớm sau sinh', 'School Medix', '2025-06-15', '2025-06-17', 'DRAFTED');

INSERT INTO vaccination_campaign (disease_id, vaccine_id, title, description, location, start_date, end_date, status) VALUES
(
  ARRAY[10], 
  11, 
  'Tiêm phòng bệnh lao (BCG), tiêm sớm sau sinh', 
  'THÔNG BÁO VỀ CHIẾN DỊCH TIÊM PHÒNG BỆNH LAO (BCG)
	Nhà trường phối hợp với Trung tâm Y tế tổ chức Chiến dịch tiêm phòng vắc xin BCG nhằm bảo vệ trẻ sơ sinh và trẻ nhỏ khỏi bệnh lao – một bệnh truyền nhiễm nguy hiểm do vi khuẩn Mycobacterium tuberculosis gây ra. Vắc xin BCG được khuyến cáo tiêm sớm sau sinh để tăng cường khả năng miễn dịch cho trẻ.
	
	Thông tin chi tiết:
	- Thời gian: Từ ngày 15/06/2025 đến ngày 17/06/2025
	- Địa điểm: School Medix, Phòng Y tế Trường học
	- Đối tượng: Trẻ sơ sinh và trẻ dưới 1 tháng tuổi (ưu tiên tiêm sớm sau sinh)
	- Vắc xin: BCG (sản xuất tại Việt Nam, an toàn và hiệu quả)
	
	Chiến dịch được thực hiện bởi đội ngũ y tế chuyên nghiệp, đảm bảo an toàn và tuân thủ các quy định y tế. Quý phụ huynh vui lòng đăng ký trước tại văn phòng nhà trường hoặc qua email health@schoolmedix.edu.vn trước ngày 10/06/2025 để sắp xếp lịch tiêm.
	
	Để biết thêm chi tiết, vui lòng liên hệ Phòng Y tế qua số điện thoại: (+84) 123 456 789.
	
	Trân trọng,
	Ban Giám Hiệu',
  'School Medix', 
  '2025-10-15', 
  '2025-10-17',  
  'DRAFTED'
);
--vaccination_campaign_register
CREATE TABLE vaccination_campaign_register (
    id SERIAL PRIMARY KEY,
    student_id varchar(10) NOT NULL,
	  campaign_id int not null,
    reason TEXT,
    is_registered BOOLEAN NOT NULL DEFAULT false,
    submit_time TIMESTAMP,
    submit_by int, -- parent ID
	  FOREIGN KEY (campaign_id) REFERENCES vaccination_campaign(id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (submit_by) REFERENCES parent(id)
);	

--vacination_record
CREATE TABLE vaccination_record (
    id SERIAL PRIMARY KEY,
    student_id varchar(10) NOT NULL,
    register_id INT, -- NULL nếu không đăng ký qua campaign
    -- campaign_id INT, -- NULL nếu không thuộc campaign khỏi lưu cái này cx đc
	  disease_id INT[] NOT NULL,
    vaccine_id INT, -- khác NULL nếu parent đăng ký tiêm ở chỗ khác mà không thông qua campaign nhà trường
    description TEXT,
    location VARCHAR(255),
    vaccination_date DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'MISSED',  'CANCELLED')),
    pending VARCHAR(50) CHECK (pending IN ('PENDING', 'DONE', 'CANCELLED', NULL)),
    reason_by_nurse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (register_id) REFERENCES vaccination_campaign_register(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccine(id),
    CONSTRAINT unique_student_vaccine_date UNIQUE (student_id, vaccine_id, register_id)
);


INSERT INTO vaccination_record (
  student_id,
  register_id,
  disease_id,
  vaccine_id,
  vaccination_date,
  description,
  location,
  status
)
VALUES
  (
    '211000',
    NULL,
    ARRAY[8],
    3,
    '2023-06-15',
    'Tiêm bên ngoài',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211002',
    NULL,
    ARRAY[8],
    5,
    '2025-06-20',
    'Tiêm bên ngoài',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211001',
    NULL,
    ARRAY[8],
    4,
    '2025-06-22',
    'Tiêm bên ngoài',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211003',
    NULL,
    ARRAY[9],
    7,
    '2025-06-25',
    'Tiêm bên ngoài',
    'School Medix',
    'COMPLETED'
  );


---------------------------------------------------------------------------------------------------------------------------------------END FLOW VACCINATION


---------------------------------------------------------------------------------------------------------------------------------------FLOW DaiLyHealthRecord
----------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE daily_health_record (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    detect_time DATE NOT NULL,
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    on_site_treatment TEXT,
    transferred_to TEXT,
    items_usage TEXT,
    status VARCHAR(50) CHECK (status IN ('MILD', 'SERIOUS')),
    FOREIGN KEY (student_id) REFERENCES student(id)
);

CREATE INDEX idx_daily_health_record_detect_time ON daily_health_record(detect_time);
CREATE INDEX idx_daily_health_record_status ON daily_health_record(status);

INSERT INTO daily_health_record (
    student_id, detect_time, diagnosis, on_site_treatment, transferred_to, items_usage, status
)
VALUES 
('211000', '2025-07-05', 'Chảy máu cam', 'Nằm nghỉ, nghiêng đầu về trước', NULL, 'Bông gòn', 'MILD'),
('211000', '2025-07-01', 'Đau mắt đỏ', 'Nhỏ mắt Natri Clorid 0.9%', NULL, 'Thuốc nhỏ mắt', 'MILD'),

('211001', '2025-07-08', 'Ho và sổ mũi', 'Uống thuốc ho thảo dược', NULL, 'Thuốc ho, giấy lau', 'MILD'),
('211001', '2025-07-02', 'Đau răng', 'Súc miệng nước muối, thông báo phụ huynh', NULL, 'Nước muối sinh lý', 'MILD'),

('211002', '2025-07-03', 'Ngã cầu thang nhẹ', 'Kiểm tra vết thương, theo dõi 15 phút', NULL, 'Băng dán, nước sát khuẩn', 'SERIOUS'),
('211002', '2025-07-31', 'Sốt 38.5°C', 'Đặt khăn lạnh, uống hạ sốt', NULL, 'Paracetamol 250mg', 'MILD'),

('211003', '2025-07-07', 'Nổi mẩn đỏ toàn thân', 'Thông báo phụ huynh, theo dõi phản ứng', 'Trạm Y tế Phường 3', 'Kem chống ngứa', 'SERIOUS'),
('211003', '2025-07-03', 'Khó tiêu', 'Uống men tiêu hóa', NULL, 'Men tiêu hóa gói', 'MILD');

-----------------------------------------------------------------------------------------END FLOW DaiLyHealthRecord


-----------------------------------------------------------------------------------------FLOW GIÁM SÁT BỆNH MÃN TÍNH VÀ BỆNH TRUYỀN NHIỄM
--------------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE disease_record (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    disease_id INT NOT NULL,
    diagnosis TEXT,
    detect_date DATE,
    cure_date DATE,
    location_cure TEXT,
    transferred_to TEXT,
    status VARCHAR(50) CHECK (status IN ('RECOVERED', 'UNDER_TREATMENT')),
    pending VARCHAR(50) CHECK (pending IN ('PENDING', 'DONE', 'CANCELLED')),
    reason_by_nurse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (disease_id) REFERENCES disease(id)
);

INSERT INTO disease_record (
    student_id, disease_id, diagnosis, detect_date, cure_date, location_cure, transferred_to, status
) 
VALUES
('211000', 1, 'Phát ban và sốt nhẹ', '2025-05-01', '2025-05-05', 'Trạm Y tế Quận 1', NULL, 'RECOVERED'),
('211001', 2, 'Ho và nổi mẩn nhẹ', '2025-04-10', NULL, 'Tự theo dõi tại nhà', NULL, 'UNDER_TREATMENT'),
('211002', 1, 'Sốt, viêm họng', '2025-03-15', '2025-03-20', 'Phòng khám Nhi', NULL, 'RECOVERED'),
('211003', 2, 'Cảm lạnh nhẹ', '2025-02-01', NULL, 'Nhà theo dõi', NULL, 'UNDER_TREATMENT'),
('211000', 3, 'Mụn nước toàn thân, ngứa', '2025-06-01', '2025-06-06', 'Bệnh viện Nhi Đồng 1', NULL, 'RECOVERED'),
('211001', 4, 'Phát ban tay chân, lở miệng', '2025-05-10', NULL, 'Nhà theo dõi', NULL, 'UNDER_TREATMENT'),
('211002', 5, 'Mệt mỏi, vàng da nhẹ', '2025-04-20', NULL, 'Trạm y tế phường 5', NULL, 'UNDER_TREATMENT'),
('211003', 6, 'Khó thở, đau họng nặng', '2025-03-25', '2025-04-01', 'Phòng khám chuyên khoa', NULL, 'RECOVERED'),
('211000', 7, 'Thở khò khè, cần dùng ống hít', '2025-01-12', NULL, 'Nhà theo dõi', NULL, 'UNDER_TREATMENT'),
('211001', 8, 'Cân nặng vượt chuẩn, bác sĩ tư vấn giảm cân', '2025-01-05', NULL, 'Bệnh viện dinh dưỡng', NULL, 'UNDER_TREATMENT');
    
-------------------------------------------------------------------------------------------------------------------------------------- OTP
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target text, -- email, sdt,...
  otp TEXT,
  purpose TEXT,   
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_otp_lookup ON otps (target, purpose, is_used);

-------------------------------------------------------------------------------------------------------------------------------------- Blog

CREATE TABLE BLOG_TYPE (
	ID SERIAL PRIMARY KEY,
	NAME TEXT,
	DESCRIPTION TEXT
);

INSERT INTO
	BLOG_TYPE (NAME, DESCRIPTION)
VALUES	
	(
		'Tin tức',
		'Kiến thức về chế độ ăn, dinh dưỡng cho học sinh'
	),
	(
		'Hướng dẫn',
		'Các phương pháp, hoạt động giữ gìn và nâng cao sức khỏe cho học sinh'
	),
	(
		'Đánh giá',
		'Chia sẻ, tư vấn về tâm lý lứa tuổi học sinh, cách vượt qua áp lực học tập'
	),
	(
		'Chia sẻ',
		'Thông tin về phòng ngừa các bệnh thường gặp ở trường học'
);
	

-- 2. Bảng blog (có thumbnail_url)
CREATE TYPE BLOG_STATUS AS ENUM('DRAFTED', 'PUBLISHED');

CREATE TABLE BLOG (
	ID SERIAL PRIMARY KEY,
	TITLE VARCHAR(255) NOT NULL,
	CONTENT TEXT NOT NULL,
	THUMBNAIL_URL VARCHAR(255), -- ảnh đại diện
	CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UPDATED_AT TIMESTAMP DEFAULT NULL,
	IS_DELETED BOOLEAN DEFAULT FALSE,
	STATUS BLOG_STATUS DEFAULT 'DRAFTED',
	BLOG_TYPE_ID INTEGER REFERENCES BLOG_TYPE (ID) ON DELETE SET NULL
);

----Blog 1 
INSERT INTO
	BLOG (TITLE, CONTENT, THUMBNAIL_URL, BLOG_TYPE_ID)
VALUES
	(
		'Tầm quan trọng của dinh dưỡng đối với học sinh',
		'<h2>I. Dinh dưỡng học đường là gì?</h2>
<p><strong>Dinh dưỡng học đường</strong> là chế độ ăn uống khoa học, hợp lý dành riêng cho trẻ em và thanh thiếu niên trong độ tuổi đến trường. Việc đảm bảo dinh dưỡng tốt không chỉ giúp học sinh phát triển thể chất mà còn nâng cao trí tuệ, phòng tránh bệnh tật.</p>

<h2>II. Tác động của dinh dưỡng đến sức khỏe và học tập</h2>
<ul>
  <li><strong>Phát triển chiều cao, cân nặng:</strong> Trẻ được ăn uống đầy đủ sẽ tăng trưởng tốt, phát triển đồng đều.</li>
  <li><strong>Cải thiện khả năng tập trung:</strong> Một số nghiên cứu cho thấy, học sinh ăn sáng đủ chất có khả năng tập trung và tiếp thu bài tốt hơn.</li>
  <li><strong>Tăng sức đề kháng:</strong> Chế độ ăn cân đối giúp trẻ phòng tránh được nhiều bệnh vặt như cảm cúm, nhiễm trùng.</li>
  <li><strong>Hạn chế nguy cơ mắc các bệnh mãn tính:</strong> Béo phì, tiểu đường, suy dinh dưỡng,... đều có thể phòng tránh nhờ ăn uống lành mạnh.</li>
</ul>

<h2>III. Những sai lầm phổ biến trong dinh dưỡng học đường</h2>
<ul>
  <li><strong>Bỏ bữa sáng:</strong> Nhiều học sinh do dậy muộn hoặc không đói nên bỏ qua bữa sáng, làm giảm năng lượng học tập đầu ngày.</li>
  <li><strong>Ăn vặt quá nhiều:</strong> Thực phẩm như bánh snack, nước ngọt, trà sữa chứa nhiều đường, chất béo xấu gây béo phì.</li>
  <li><strong>Bữa ăn thiếu rau xanh và trái cây:</strong> Nhiều em chỉ thích ăn thịt cá, bỏ qua nhóm vitamin và khoáng chất.</li>
</ul>

<h2>IV. Gợi ý thực đơn lành mạnh cho học sinh</h2>
<ul>
  <li><strong>Bữa sáng:</strong> Cháo thịt, bánh mì trứng, sữa tươi hoặc ngũ cốc.</li>
  <li><strong>Bữa trưa:</strong> Cơm, thịt/cá, canh rau củ, trái cây tráng miệng.</li>
  <li><strong>Bữa xế:</strong> Sữa chua, trái cây, một ít hạt (hạnh nhân, óc chó...)</li>
  <li><strong>Bữa tối:</strong> Cơm, tôm/thịt nạc, rau luộc/xào, canh.</li>
</ul>
<p><img src="https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images//bua-an-dinh-duong.jpg" alt="Bữa ăn học đường" style="max-width:100%"></p>

<h2>V. Lời khuyên từ chuyên gia dinh dưỡng</h2>
<blockquote>
  “<strong>Dinh dưỡng hợp lý là nền tảng cho sự phát triển thể chất và tinh thần của trẻ.</strong> Cha mẹ, nhà trường cần phối hợp để xây dựng bữa ăn đa dạng, đủ 4 nhóm chất: bột đường, đạm, béo, vitamin và khoáng chất. Hạn chế đồ ăn nhanh, thức uống có ga.”
</blockquote>
<p><em><strong>Lưu ý:</strong> Học sinh nên uống đủ nước (1,5–2 lít/ngày), tránh bỏ bữa, không ăn quá mặn hoặc quá ngọt.</em></p>
',
'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images//thap-dinh-duong-cho-tre-em.jpg',
		1
	);

----Blog 2

INSERT INTO BLOG (TITLE, CONTENT, THUMBNAIL_URL, BLOG_TYPE_ID)
VALUES (
  'Những thói quen ăn uống lành mạnh cho học sinh tiểu học',
  '<h2>I. Vì sao cần hình thành thói quen ăn uống từ nhỏ?</h2>
<p>Giai đoạn tiểu học là thời điểm cơ thể và trí não trẻ phát triển mạnh mẽ. Thiết lập <strong>thói quen ăn uống lành mạnh</strong> từ sớm giúp trẻ:</p>
<ul>
  <li>Hình thành nền tảng sức khỏe tốt lâu dài.</li>
  <li>Phòng ngừa các bệnh dinh dưỡng: béo phì, suy dinh dưỡng, thiếu vi chất.</li>
  <li>Tăng khả năng học tập, tập trung và sáng tạo.</li>
</ul>

<h2>II. Những thói quen ăn uống tốt nên rèn luyện</h2>
<ul>
  <li><strong>Ăn đủ 3 bữa chính và 1–2 bữa phụ mỗi ngày:</strong> Đảm bảo cung cấp đủ năng lượng và dưỡng chất.</li>
  <li><strong>Không bỏ bữa sáng:</strong> Đây là bữa ăn quan trọng giúp não bộ hoạt động hiệu quả.</li>
  <li><strong>Ưu tiên thực phẩm tươi sạch, tự nhiên:</strong> Hạn chế đồ chế biến sẵn, chiên rán.</li>
  <li><strong>Bổ sung đủ rau xanh và trái cây:</strong> Cung cấp vitamin, khoáng chất và chất xơ cho hệ tiêu hóa khỏe mạnh.</li>
  <li><strong>Uống đủ nước:</strong> Trẻ nên uống 1,5–2 lít nước/ngày, tránh các loại nước ngọt có gas.</li>
</ul>

<h2>III. Những thực phẩm nên tránh cho học sinh</h2>
<ul>
  <li>Đồ ăn nhanh: gà rán, khoai tây chiên, mì gói...</li>
  <li>Đồ ngọt nhiều đường: kẹo, bánh quy, nước ngọt, trà sữa.</li>
  <li>Đồ uống có caffein: trà đặc, cà phê, nước tăng lực.</li>
  <li>Món ăn quá mặn hoặc cay: ảnh hưởng tiêu hóa và thận.</li>
</ul>

<h2>IV. Gợi ý hộp cơm học đường cân bằng dinh dưỡng</h2>
<ul>
  <li><strong>Protein:</strong> Thịt nạc, cá, trứng, đậu hũ.</li>
  <li><strong>Tinh bột:</strong> Cơm gạo lứt, bánh mì nguyên cám, khoai lang.</li>
  <li><strong>Rau củ:</strong> Cà rốt, cải xanh, đậu que, súp lơ.</li>
  <li><strong>Trái cây:</strong> Chuối, táo, dưa hấu, cam.</li>
</ul>
<p><img src="https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images/hop-com-hoc-duong.jpg" alt="Hộp cơm học đường" style="max-width:100%"></p>

<h2>V. Vai trò của phụ huynh và nhà trường</h2>
<blockquote>
  “<strong>Sự phối hợp giữa gia đình và nhà trường</strong> là yếu tố then chốt trong việc hình thành thói quen ăn uống tốt. Phụ huynh nên chuẩn bị bữa ăn sạch – đủ – đúng, đồng thời nhà trường cần giáo dục trẻ về dinh dưỡng qua hoạt động ngoại khóa, bài giảng lồng ghép.”
</blockquote>

<p><em><strong>Lưu ý:</strong> Hãy để trẻ tham gia vào quá trình chuẩn bị bữa ăn để tăng hứng thú, giáo dục trẻ chọn thực phẩm tốt và xây dựng thói quen ăn chậm, nhai kỹ.</em></p>',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images/img_1752039066915_4033.gif',
  1
);

----Blog 3
INSERT INTO BLOG (TITLE, CONTENT, THUMBNAIL_URL, BLOG_TYPE_ID)
VALUES (
  'Chăm sóc sức khỏe học đường – Phương pháp & hoạt động thiết thực',
  '<h2>I. Sức khỏe học đường là gì?</h2>
<p><strong>Sức khỏe học đường</strong> là tổng hòa các yếu tố liên quan đến thể chất, tinh thần và môi trường sống của học sinh trong trường học. Một môi trường học đường lành mạnh giúp học sinh phát triển toàn diện, học tập hiệu quả và phòng ngừa bệnh tật.</p>

<h2>II. Vai trò của chăm sóc sức khỏe trong nhà trường</h2>
<ul>
  <li><strong>Phòng tránh bệnh tật:</strong> Kiểm tra sức khỏe định kỳ giúp phát hiện sớm các vấn đề như cận thị, sâu răng, thiếu máu, suy dinh dưỡng...</li>
  <li><strong>Đảm bảo vệ sinh môi trường học:</strong> Trường lớp sạch sẽ, đủ ánh sáng, thông thoáng giúp giảm nguy cơ lây nhiễm bệnh.</li>
  <li><strong>Giáo dục thể chất và tinh thần:</strong> Các hoạt động thể thao, ngoại khóa giúp học sinh phát triển thể lực và kỹ năng sống.</li>
</ul>

<h2>III. Các phương pháp chăm sóc sức khỏe cho học sinh</h2>
<ul>
  <li><strong>Khám sức khỏe định kỳ:</strong> Mỗi học kỳ nên tổ chức kiểm tra mắt, răng miệng, chiều cao, cân nặng cho học sinh.</li>
  <li><strong>Tiêm chủng đầy đủ:</strong> Đảm bảo học sinh được tiêm các vaccine cơ bản như sởi, quai bị, rubella, viêm gan B...</li>
  <li><strong>Giữ vệ sinh cá nhân:</strong> Hướng dẫn rửa tay đúng cách, đánh răng sau ăn, giữ vệ sinh thân thể.</li>
  <li><strong>Chế độ dinh dưỡng hợp lý:</strong> Kết hợp bữa ăn học đường đầy đủ 4 nhóm chất và thực phẩm an toàn.</li>
</ul>

<h2>IV. Hoạt động thực tế trong chăm sóc sức khỏe học đường</h2>
<ul>
  <li>Tổ chức ngày hội sức khỏe, tuyên truyền vệ sinh cá nhân.</li>
  <li>Lồng ghép bài học kỹ năng sống về chăm sóc bản thân.</li>
  <li>Thi đua thể thao giữa các lớp nhằm khuyến khích vận động.</li>
  <li>Bố trí cán bộ y tế học đường túc trực, xử lý tình huống y tế cơ bản.</li>
</ul>
<p><img src="https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images/suc-khoe-hoc-duong.jpg" alt="Hoạt động sức khỏe học đường" style="max-width:100%"></p>

<h2>V. Gợi ý cho phụ huynh và nhà trường</h2>
<blockquote>
  “<strong>Sức khỏe học sinh là ưu tiên hàng đầu</strong>. Phụ huynh và nhà trường cần phối hợp chặt chẽ trong việc xây dựng lối sống lành mạnh, tạo môi trường học tập tích cực, an toàn cho trẻ.”
</blockquote>

<p><em><strong>Lưu ý:</strong> Ngoài sức khỏe thể chất, cần quan tâm đến sức khỏe tâm lý học đường: phòng chống bạo lực học đường, áp lực học tập, trầm cảm học sinh...</em></p>',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images/img_1752039118375_7282.jpg',
  2
);

---Blog 4
INSERT INTO BLOG (TITLE, CONTENT, THUMBNAIL_URL, BLOG_TYPE_ID)
VALUES (
  'Tâm lý học đường – Hiểu và vượt qua áp lực tuổi học trò',
  '<h2>I. Tâm lý học đường là gì?</h2>
<p><strong>Tâm lý học đường</strong> là những cảm xúc, suy nghĩ, hành vi của học sinh trong môi trường học tập. Đây là giai đoạn các em hình thành nhân cách, dễ chịu ảnh hưởng bởi bạn bè, kỳ vọng của gia đình, áp lực học hành và cả mạng xã hội.</p>

<h2>II. Nguyên nhân gây áp lực tâm lý ở học sinh</h2>
<ul>
  <li><strong>Áp lực học tập:</strong> Kỳ vọng điểm cao, thi cử căng thẳng, bài tập nhiều dễ khiến học sinh mệt mỏi.</li>
  <li><strong>Sự so sánh:</strong> So sánh với bạn bè về điểm số, ngoại hình, khả năng khiến các em tự ti.</li>
  <li><strong>Mâu thuẫn với phụ huynh, thầy cô:</strong> Khi không được lắng nghe, học sinh dễ bị tổn thương tinh thần.</li>
  <li><strong>Bắt nạt học đường hoặc cô lập xã hội:</strong> Dễ gây trầm cảm, lo âu, sợ đến trường.</li>
</ul>

<h2>III. Dấu hiệu học sinh gặp vấn đề tâm lý</h2>
<ul>
  <li>Thường xuyên mệt mỏi, mất ngủ hoặc ngủ quá nhiều.</li>
  <li>Giảm hứng thú học tập, bỏ bê việc học, dễ cáu gắt.</li>
  <li>Thu mình, không muốn giao tiếp hoặc thay đổi hành vi bất thường.</li>
  <li>Xuất hiện suy nghĩ tiêu cực hoặc hành vi tự làm tổn thương bản thân.</li>
</ul>

<h2>IV. Cách hỗ trợ học sinh vượt qua áp lực tâm lý</h2>
<ul>
  <li><strong>Lắng nghe và thấu hiểu:</strong> Hãy để học sinh được nói ra suy nghĩ mà không bị phán xét.</li>
  <li><strong>Giúp các em quản lý thời gian:</strong> Lên lịch học tập – nghỉ ngơi hợp lý, tránh học dồn ép.</li>
  <li><strong>Khuyến khích vận động và giải trí lành mạnh:</strong> Thể thao, âm nhạc, hội họa giúp giải tỏa căng thẳng.</li>
  <li><strong>Kết nối với chuyên gia tâm lý học đường:</strong> Khi có dấu hiệu bất ổn, cần tư vấn chuyên môn kịp thời.</li>
</ul>
<p><img src="https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images/tam-ly-hoc-duong.jpg" alt="Tư vấn tâm lý học đường" style="max-width:100%"></p>

<h2>V. Thông điệp dành cho phụ huynh và nhà trường</h2>
<blockquote>
  “<strong>Một học sinh khỏe mạnh không chỉ là khỏe về thể chất mà còn ổn định về mặt tinh thần.</strong> Mỗi em đều cần được yêu thương, lắng nghe và tôn trọng trong hành trình trưởng thành.”
</blockquote>

<p><em><strong>Lưu ý:</strong> Đừng xem nhẹ những biểu hiện tâm lý ở học sinh. Việc đồng hành, chia sẻ đúng lúc có thể giúp trẻ vượt qua khủng hoảng và phát triển tích cực hơn.</em></p>',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/blog-images/img_1752039012599_4286.jpg',
  3
);
---Blog 5
