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
  is_deleted BOOLEAN DEFAULT false not null
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
  email_confirmed
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
  true
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
  is_deleted BOOLEAN DEFAULT false not null
);
-- start nurse id from 100000
ALTER SEQUENCE nurse_id_seq RESTART WITH 100000;

INSERT INTO Nurse (
  supabase_uid,
  email,
  name,
  dob,
  isMale,
  address,
  phone_number,
  profile_img_url,
  email_confirmed
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
  true
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
  is_deleted BOOLEAN DEFAULT false not null
);

-- start parent id from 100000
ALTER SEQUENCE parent_id_seq RESTART WITH 100000;

INSERT INTO parent (
  supabase_uid, email, name, dob, isMale, address, phone_number, profile_img_url, email_confirmed
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
    true
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
    true
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
    true
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
    true
  );

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
      is_deleted BOOLEAN DEFAULT false not null,
      class_id INT REFERENCES class(id) not null,
      mom_id int REFERENCES parent(id),
      dad_id int REFERENCES parent(id)
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
  dad_id
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
  NULL
),
(
  '211001',
  'fc57f7ed-950e-46fb-baa5-7914798e9ae3',
  'dinhvietnam2910@gmail.com',
  'Hoàng Tấn Tạ Yến',
  '2014-02-10',
  false ,
  'Chung cư Xóm Nhỏ, Quận Hoàn Kiếm, Hà Nội',
  '0123456789',
  'https://mwbzaadpjjoqtwnmfrnm.supabase.co/storage/v1/object/public/public-files//anonymous-avatar.jpg',
  2021,
  true,
  2,
  100003,
  100002
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
  100000
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
  100000
);


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
    prescription_file_url VARCHAR(512),
    status senddrugrequest_status NOT NULL
);

INSERT INTO SendDrugRequest (
    student_id, create_by, diagnosis, schedule_send_date, receive_date,
    intake_date, note, prescription_file_url, status
) VALUES 
(
    '211000', -- student_id
    100003,   -- create_by
    'Viêm dạ dày cấp',
    '2025-06-10',
    NULL,
    '2025-06-11',
    'Cần gửi thuốc sớm',
    'https://luatduonggia.vn/wp-content/uploads/2025/06/quy-dinh-ve-noi-dung-ke-don-thuoc1.jpg',
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
    'https://cdn.lawnet.vn//uploads/NewsThumbnail/2019/02/26/0852441417662920-thuc-pham-chuc-nang.jpg',
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
    'https://static.tuoitre.vn/tto/i/s626/2011/04/12/2FiN0VCC.jpg',
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
    status campaign_status NOT NULL DEFAULT 'PREPARING'
);

INSERT INTO CheckupCampaign (
    name,
    description,
    location,
    start_date,
    end_date,
    status
) VALUES
(
    'Khám sức khỏe định kỳ học sinh năm 2025',
    'Chiến dịch khám sức khỏe tổng quát cho toàn bộ học sinh trong trường. Thời gian dự kiến: 8h sáng.',
    'nhà đa năng tầng 4',
    '2025-09-01',
    '2025-09-10',
    'CANCELLED'
),
(
    'Định kỳ + Khám mắt và răng học sinh',
    'Khám chuyên sâu về mắt và răng, phối hợp với phòng khám chuyên khoa. Thời gian dự kiến: 8h sáng ngày 5/10/25',
    'sân trường',
    '2025-10-05',
    '2025-10-12',
    'DONE'
),
(
    'Khám tâm lý học đường',
    'Tư vấn và hỗ trợ tâm lý cho học sinh cần thiết',
    'sân trường',
    '2025-08-15',
    '2025-08-20',
    'PREPARING'
);

CREATE TABLE SpecialistExamList (
	id serial primary key,
	name VARCHAR(100) NOT NULL,
    description TEXT,
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO SpecialistExamList (
    name,
    description
) VALUES
(
    'Khám nội tổng quát',
    'Đánh giá tổng thể sức khỏe các cơ quan nội khoa như tim mạch, hô hấp, tiêu hóa, tiết niệu, phát hiện sớm các dấu hiệu bất thường.'
),
(
    'Khám ngoại khoa',
    'Khám và đánh giá hệ vận động, xương khớp, phát hiện các chấn thương, dị tật hoặc các vấn đề về cơ xương khớp.'
),
(
    'Khám mắt',
    'Kiểm tra thị lực, tật khúc xạ (cận thị, viễn thị, loạn thị), các bệnh lý về mắt và tư vấn chăm sóc mắt.'
),
(
    'Khám tai mũi họng',
    'Kiểm tra sức khỏe tai, mũi, họng; phát hiện các bệnh lý viêm nhiễm, dị ứng hoặc các bất thường về thính lực và hô hấp trên.'
),
(
    'Khám răng hàm mặt',
    'Khám và đánh giá sức khỏe răng miệng, phát hiện sâu răng, viêm lợi, lệch khớp cắn, tư vấn vệ sinh răng miệng.'
),
(
    'Khám da liễu',
    'Đánh giá tình trạng da, phát hiện các bệnh lý ngoài da thường gặp ở lứa tuổi học sinh như viêm da, dị ứng, nhiễm trùng da.'
),
(
    'Khám sinh dục',
    'Đánh giá sức khỏe cơ quan sinh dục, phát hiện bất thường, tư vấn sức khỏe sinh sản, đặc biệt cho lứa tuổi dậy thì.'
),
(
    'Khám tâm lý',
    'Tư vấn tâm lý học đường, hỗ trợ học sinh giải quyết các vấn đề về cảm xúc, hành vi, stress học tập và kỹ năng thích ứng xã hội.'
),
(
    'Khám tâm thần',
    'Khám sàng lọc nhằm phát hiện sớm các dấu hiệu rối loạn tâm thần, tư vấn và chuyển tuyến chuyên khoa khi cần thiết.'
),
(
    'Khám dinh dưỡng',
    'Đánh giá tình trạng dinh dưỡng, tư vấn chế độ ăn uống, phát hiện suy dinh dưỡng, thừa cân, béo phì hoặc các vấn đề dinh dưỡng khác.'
),
(
    'Khám xâm lấn',
    'Các thủ thuật y tế có can thiệp trực tiếp vào cơ thể như lấy máu xét nghiệm, tiêm chủng, hoặc các thủ thuật khác khi cần thiết.'
);


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

INSERT INTO CheckupRegister (
    campaign_id,
    student_id,
    submit_by,
    reason,
    status
) VALUES
(
    1,
    '211000',
    100002,
    'Đăng ký khám mắt và răng',
    'CANCELLED'
),
(
    1,
    '211001',
    100000,
    'Hỗ trợ tư vấn tâm lý',
    'CANCELLED'
),
(
    1,
    '211002',
    100001,
    'Khám sinh dục tuổi dậy thì',
    'CANCELLED'
),
(
    1,
    '211003',
    100002,
    'Đăng ký khám tổng quát',
    'CANCELLED'
),
(
    2,
    '211000',
    100000,
    'Đăng ký khám mắt định kỳ',
    'PENDING'
),
(
    2,
    '211001',
    100001,
    'Tư vấn tâm lý bổ sung',
    'PENDING'
),
(
    2,
    '211002',
    100003,
    'Khám sinh dục bổ sung',
    'SUBMITTED'
),
(
    2,
    '211003',
    100000,
    'Khám tổng quát lần 2',
    'SUBMITTED'
),
(
    3,
    '211000',
    100003,
    'Hỗ trợ tâm lý bổ sung',
    'PENDING'
),
(
    3,
    '211001',
    100001,
    'Đăng ký khám mắt',
    'SUBMITTED'
),
(
    3,
    '211002',
    100000,
    'Khám sức khỏe định kỳ',
    'SUBMITTED'
),
(
    3,
    '211003',
    100002,
    'Khám sinh dục bổ sung',
    'SUBMITTED'
);



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
	  is_checked BOOLEAN DEFAULT FALSE,
	  status health_record_status NOT NULL DEFAULT 'WAITING'
);

INSERT INTO HealthRecord (register_id, status) VALUES 
(1,'CANCELLED'),
(2,'CANCELLED'),
(3,'CANCELLED'),
(4,'CANCELLED');


INSERT INTO HealthRecord (
    register_id,
    height,
    weight,
    blood_pressure,
    left_eye,
    right_eye,
    ear,
    nose,
    throat,
    teeth,
    gums,
    skin_condition,
    heart,
    lungs,
    spine,
    posture,
    final_diagnosis,
    is_checked,
    status
) VALUES
(
    5,
    '150cm',
    '40kg',
    '110/70',
    '10/10',
    '10/10',
    'Bình thường',
    'Không viêm',
    'Không viêm',
    'Bình thường',
    'Hồng hào',
    'Không mẩn đỏ',
    'Bình thường',
    'Bình thường',
    'Thẳng',
    'Bình thường',
    'Sức khỏe tốt',
    TRUE,
    'DONE'
),
(
    6,
    '155cm',
    '42kg',
    '105/70',
    '10/10',
    '9/10',
    'Bình thường',
    'Không viêm',
    'Không viêm',
    'Răng hơi sâu',
    'Bình thường',
    'Không có vấn đề',
    'Bình thường',
    'Bình thường',
    'Hơi lệch',
    'Tư thế tốt',
    'Cần theo dõi tâm lý',
    TRUE,
    'DONE'
),
(
    7,
    '152cm',
    '41kg',
    '100/65',
    '10/10',
    '10/10',
    'Bình thường',
    'Không viêm',
    'Hơi đỏ',
    'Bình thường',
    'Bình thường',
    'Da nhạy cảm',
    'Tốt',
    'Bình thường',
    'Thẳng',
    'Bình thường',
    'Tạm hoãn do lý do cá nhân',
    TRUE,
    'DONE'
),
(
    8,
    '149cm',
    '39kg',
    '115/75',
    '9/10',
    '9/10',
    'Bình thường',
    'Không viêm',
    'Không viêm',
    'Bình thường',
    'Bình thường',
    'Không mẩn',
    'Bình thường',
    'Bình thường',
    'Bình thường',
    'Bình thường',
    'Khuyến cáo bổ sung dinh dưỡng',
    TRUE,
    'DONE'
);

INSERT INTO HealthRecord (register_id, status) VALUES 
(9,'WAITING'),
(10,'WAITING'),
(11,'WAITING'),
(12,'WAITING');


CREATE TYPE specialist_exam_record_status AS ENUM ('CANNOT_ATTACH', 'WAITING', 'DONE');
CREATE TABLE specialistExamRecord (
    register_id INT NOT NULL,
    spe_exam_id INT NOT NULL,
    result TEXT,
    diagnosis TEXT,
    diagnosis_paper_url VARCHAR(255),
	is_checked BOOLEAN DEFAULT FALSE,
    status specialist_exam_record_status NOT NULL DEFAULT 'CANNOT_ATTACH',
    PRIMARY KEY (register_id, spe_exam_id),
    FOREIGN KEY (register_id) REFERENCES CheckupRegister(id),
    FOREIGN KEY (spe_exam_id) REFERENCES SpecialistExamList(id)
);

INSERT INTO specialistExamRecord (register_id,spe_exam_id) VALUES 
(1,1),
(1,3),
(2,1),
(2,3),
(3,1),
(3,3),
(4,1),
(4,3);


INSERT INTO specialistExamRecord (
    register_id, 
    spe_exam_id,
    result,
    diagnosis,
    diagnosis_paper_url,
    is_checked,
    status
) VALUES
(
    5,
    1,
    'Bình thường',
    'Sức khỏe sinh dục tốt, không có bất thường',
    'http://example.com/doc1.pdf',
    TRUE,
    'DONE'
),
(
    6,
    2,
    'Ổn định',
    'Tâm lý ổn định, không có dấu hiệu lo âu hay trầm cảm',
    'http://example.com/doc2.pdf',
    TRUE,
    'DONE'
),
(
    7,
    3,
    'Không có dấu hiệu',
    'Không phát hiện rối loạn tâm thần',
    'http://example.com/doc3.pdf',
    TRUE,
    'DONE'
),
(
    8,
    1,
    'Bình thường',
    'Sức khỏe sinh dục bình thường, chưa phát hiện bất thường',
    'http://example.com/doc4.pdf',
    TRUE,
    'DONE'
);

INSERT INTO specialistExamRecord (register_id,spe_exam_id,status) VALUES 
(9,4,'WAITING'),
(10,4,'WAITING'),
(11,4,'WAITING'),
(12,4,'WAITING');

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


INSERT INTO disease (disease_category, name, description, vaccine_need, dose_quantity) VALUES
('Bệnh truyền nhiễm', 'Lao', 'Gây tổn thương phổi và các cơ quan, đặc biệt nguy hiểm với trẻ sơ sinh.', true, 1),
('Bệnh truyền nhiễm', 'Viêm gan B', 'Lây qua máu và dịch cơ thể, có thể chuyển thành mãn tính.', true, 3),
('Bệnh truyền nhiễm', 'Bạch hầu', 'Vi khuẩn Corynebacterium diphtheriae gây viêm họng, khó thở.', true, 3),
('Bệnh truyền nhiễm', 'Ho gà', 'Ho dữ dội, lây qua đường hô hấp, gây biến chứng nặng cho trẻ sơ sinh.', true, 3),
('Bệnh truyền nhiễm', 'Uốn ván', 'Do vi khuẩn Clostridium tetani, gây co giật, tử vong.', true, 3),
('Bệnh truyền nhiễm', 'Bại liệt', 'Virus tấn công hệ thần kinh, gây liệt vĩnh viễn.', true, 3),
('Bệnh truyền nhiễm', 'Viêm phổi do Hib', 'Vi khuẩn Hib gây viêm phổi nguy hiểm ở trẻ em.', true, 3),
('Bệnh truyền nhiễm', 'Viêm màng não mủ do Hib', 'Biến chứng thần kinh nặng do Hib gây ra.', true, 3),
('Bệnh truyền nhiễm', 'Tiêu chảy do Rotavirus', 'Gây mất nước nhanh ở trẻ nhỏ.', true, 2),
('Bệnh truyền nhiễm', 'Viêm phổi do phế cầu khuẩn', 'Do vi khuẩn Streptococcus pneumoniae.', true, 3),
('Bệnh truyền nhiễm', 'Viêm tai giữa do phế cầu khuẩn', 'Gây đau tai, sốt, ảnh hưởng thính giác.', true, 3),
('Bệnh truyền nhiễm', 'Viêm màng não do phế cầu khuẩn', 'Viêm màng não do pneumococcus.', true, 3),
('Bệnh truyền nhiễm', 'Viêm màng não do não mô cầu B', 'Não mô cầu nhóm B gây viêm màng não cấp.', true, 2),
('Bệnh truyền nhiễm', 'Viêm màng não do não mô cầu C', 'Não mô cầu nhóm C gây nhiễm khuẩn huyết.', true, 2),
('Bệnh truyền nhiễm', 'Viêm màng não do não mô cầu A', 'Chủng não mô cầu A gây dịch bệnh.', true, 1),
('Bệnh truyền nhiễm', 'Viêm màng não do não mô cầu Y', 'Biến thể Y, ít gặp nhưng nguy hiểm.', true, 1),
('Bệnh truyền nhiễm', 'Viêm màng não do não mô cầu W-135', 'Chủng W-135 gây tổn thương đa cơ quan.', true, 1),
('Bệnh truyền nhiễm', 'Cúm', 'Virus cúm gây sốt, ho, nguy cơ suy hô hấp.', true, 1),
-- Viêm não Nhật Bản giữ 1 dòng đại diện
('Bệnh truyền nhiễm', 'Viêm não Nhật Bản', 'Virus gây viêm não cấp tính, nguy hiểm với trẻ nhỏ.', true, 2),
('Bệnh truyền nhiễm', 'Sởi', 'Phát ban toàn thân, biến chứng viêm phổi.', true, 2),
('Bệnh truyền nhiễm', 'Quai bị', 'Gây viêm tuyến nước bọt, biến chứng viêm tinh hoàn.', true, 2),
('Bệnh truyền nhiễm', 'Rubella', 'Ảnh hưởng nghiêm trọng nếu lây cho thai phụ.', true, 2),
('Bệnh truyền nhiễm', 'Thủy đậu', 'Gây mụn nước, lây qua không khí.', true, 2),
('Bệnh truyền nhiễm', 'Viêm gan A', 'Lây qua ăn uống, gây viêm gan cấp.', true, 1),
('Bệnh truyền nhiễm', 'Thương hàn', 'Do Salmonella gây sốt kéo dài, lây qua thực phẩm.', true, 1),
('Bệnh truyền nhiễm', 'Tả', 'Tiêu chảy cấp, mất nước nghiêm trọng.', true, 2),
('Bệnh truyền nhiễm', 'Sốt xuất huyết', 'Do virus Dengue, lây qua muỗi, nguy cơ xuất huyết.', true, 1),
('Bệnh truyền nhiễm', 'Dại', 'Tử vong 100% nếu không tiêm sau khi bị cắn.', true, 4),

-- Bệnh mãn tính, cần vaccine
('Bệnh mãn tính', 'Hen suyễn', 'Bệnh hô hấp mãn tính, kiểm soát bằng thuốc chứ không vaccine.', false, 0),
('Bệnh mãn tính', 'Béo phì', 'Bệnh gây chậm chạp và bệnh nền nguyên nhân của các bệnh khác', false, 0);


--vaccine
CREATE TABLE vaccine (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

INSERT INTO vaccine (name, description) VALUES
-- 1. Lao
('BCG', 'Vaccine phòng bệnh lao (BCG), tiêm sớm sau sinh'),

-- 2. Viêm gan B
('Engerix-B', 'Vaccine viêm gan B đơn thành phần'),
('Heplisav-B', 'Vaccine viêm gan B dùng cho trẻ lớn và người lớn'),

-- 3. Bạch hầu, Ho gà, Uốn ván
('DTP', 'Vaccine 3 trong 1 phòng Bạch hầu - Ho gà - Uốn ván'),
('Infanrix Hexa', 'Vaccine phối hợp DTPa-HBV-IPV-Hib'),

-- 4. Bại liệt
('IPV', 'Vaccine bại liệt bất hoạt (tiêm)'),
('OPV', 'Vaccine bại liệt sống giảm độc lực (uống)'),

-- 5. Hib
('HibTITER', 'Vaccine phòng viêm phổi và viêm màng não do Hib'),

-- 6. Rotavirus
('Rotarix', 'Vaccine phòng tiêu chảy do Rotavirus (2 liều)'),
('RotaTeq', 'Vaccine phòng tiêu chảy do Rotavirus (3 liều)'),

-- 7. Phế cầu
('Prevenar 13', 'Vaccine phế cầu khuẩn thế hệ mới, phòng 13 chủng'),
('Synflorix', 'Vaccine phòng phế cầu khuẩn 10 chủng'),

-- 8. Não mô cầu B
('Bexsero', 'Vaccine phòng bệnh do não mô cầu nhóm B'),

-- 9. Não mô cầu B, C
('Menveo', 'Vaccine phòng bệnh não mô cầu nhóm B và C'),

-- 10. Cúm
('Vaxigrip', 'Vaccine cúm bất hoạt theo mùa'),
('Influvac', 'Vaccine cúm mùa tiêm cho trẻ em'),

-- 11. Não mô cầu A, C, Y, W-135
('Menactra', 'Vaccine phòng bệnh não mô cầu nhóm A, C, Y, W-135'),

-- 12. Viêm não NB bất hoạt não chuột
('Je-Vax', 'Vaccine viêm não Nhật Bản bất hoạt truyền thống'),

-- 13. Viêm não NB bất hoạt Vero
('IMOJEV', 'Vaccine viêm não Nhật Bản bất hoạt tế bào Vero'),

-- 14. Viêm não NB sống tái tổ hợp
('SA-14-14-2', 'Vaccine viêm não Nhật Bản sống giảm độc lực'),

-- 15. Sởi, Quai bị, Rubella (Priorix)
('Priorix', 'Vaccine phối hợp MMR: sởi - quai bị - rubella (GSK)'),

-- 16. Sởi, Quai bị, Rubella (MMR II)
('MMR II', 'Vaccine phối hợp MMR: sởi - quai bị - rubella (Merck)'),

-- 17. Thủy đậu
('Varivax', 'Vaccine phòng thủy đậu (Merck)'),
('Varilrix', 'Vaccine phòng thủy đậu (GSK)'),

-- 18. Viêm gan A
('Avaxim', 'Vaccine viêm gan A dùng cho trẻ em'),

-- 19. Viêm gan A + B
('Twinrix', 'Vaccine phối hợp phòng viêm gan A và B'),

-- 20. Thương hàn
('Typhim Vi', 'Vaccine polysaccharide phòng thương hàn'),
('Ty21a', 'Vaccine uống phòng thương hàn (sống giảm độc lực)'),

-- 21. Tả
('Shanchol', 'Vaccine uống phòng tả bất hoạt'),
('Dukoral', 'Vaccine uống phòng tả có bổ sung ETEC'),

-- 22. Sốt xuất huyết
('QDENGA', 'Vaccine sốt xuất huyết thế hệ mới (Takeda)'),
('Dengvaxia', 'Vaccine sốt xuất huyết (Sanofi)'),

-- 23. Dại
('Verorab', 'Vaccine phòng dại tế bào Vero'),
('Abhayrab', 'Vaccine phòng dại bất hoạt tế bào người');

CREATE TABLE vaccine_disease (
    vaccine_id INT NOT NULL,
    disease_id INT NOT NULL,
    PRIMARY KEY (vaccine_id, disease_id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccine(id),
    FOREIGN KEY (disease_id) REFERENCES disease(id)
);

INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (1, 1);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (2, 2);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (3, 2);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (4, 3);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (4, 4);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (4, 5);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (5, 3);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (5, 4);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (5, 5);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (5, 2);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (5, 6);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (5, 7);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (6, 6);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (7, 6);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (8, 7);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (8, 8);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (9, 9);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (10, 9);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (11, 10);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (11, 11);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (11, 12);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (12, 10);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (12, 11);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (12, 12);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (13, 13);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (14, 14);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (15, 18);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (16, 18);
INSERT INTO vaccine_disease (vaccine_id, disease_id) VALUES (17, 15);

--vaccination_campaign
CREATE TABLE vaccination_campaign (
    id SERIAL PRIMARY KEY,
	disease_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PREPARING', 'UPCOMING', 'CANCELLED', 'ONGOING', 'COMPLETED')),
    FOREIGN KEY (vaccine_id) REFERENCES vaccine(id)
);

INSERT INTO vaccination_campaign (disease_id, vaccine_id, description, location, start_date, end_date, status) VALUES
(1, 1, 'Tiêm phòng bệnh lao (BCG), tiêm sớm sau sinh', 'School Medix', '2025-06-15', '2025-06-17', 'COMPLETED'),
(1, 1, 'Tiêm phòng bệnh lao (BCG), tiêm sớm sau sinh', 'School Medix', '2025-06-01', '2025-06-20', 'PREPARING'),
(2, 3, 'Tiêm phòng viêm gan B đơn thành phần', 'School Medix', '2025-06-22', '2025-06-24', 'CANCELLED'),
(3, 4, 'Tiêm Vaccine 3 trong 1 phòng Bạch hầu - Ho gà - Uốn ván', 'School Medix', '2025-06-25', '2025-06-27', 'PREPARING');

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
INSERT INTO vaccination_campaign_register (
  campaign_id,
  student_id,
  reason,
  is_registered,
  submit_time,
  submit_by
)
VALUES
(1, '211000', 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-10 08:00:00', 100003),
(1, '211001', 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-10 09:00:00', 100002),
(1, '211002', 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-11 08:30:00', 100000),
(1, '211003', 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-11 09:30:00', 100001);



--vacination_record
CREATE TABLE vaccination_record (
    id SERIAL PRIMARY KEY,
    student_id varchar(10) NOT NULL,
    register_id INT, -- NULL nếu không đăng ký qua campaign
    -- campaign_id INT, -- NULL nếu không thuộc campaign khỏi lưu cái này cx đc
	disease_id INT NOT NULL,
    vaccine_id INT, -- khác NULL nếu parent đăng ký tiêm ở chỗ khác mà không thông qua campaign nhà trường
    description TEXT,
    location VARCHAR(255),
    vaccination_date DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'MISSED',  'CANCELLED')),
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
    1,
    1,
    1,
    '2025-06-15',
    'Tiêm vaccine BCG phòng bệnh Lao',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211000',
    NULL,
    2,
    3,
    '2025-06-15',
    'Tiêm vaccine Heplisav-B phòng bệnh Viêm gan B',
    'School Medix',
    'CANCELLED'
  ),
  (
    '211000',
    1,
    2,
    2,
    '2025-06-15',
    'Tiêm vaccine Engerix-B phòng bệnh Viêm gan B',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211002',
    3,
    1,
    1,
    '2025-06-16',
    'Tiêm vaccine BCG phòng bệnh Lao',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211003',
    4,
    1,
    1,
    '2025-06-17',
    'Tiêm vaccine BCG phòng bệnh Lao',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211002',
    3,
    3,
    5,
    '2025-06-20',
    'Tiêm vaccine Infanrix Hexa phòng bệnh Bạch hầu, Ho gà, Uốn ván',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211001',
    2,
    3,
    4,
    '2025-06-22',
    'Tiêm vaccine DTP phòng bệnh Bạch hầu, Ho gà, Uốn ván',
    'School Medix',
    'CANCELLED'
  ),
  (
    '211003',
    4,
    4,
    7,
    '2025-06-25',
    'Tiêm vaccine OPV phòng bệnh Bại liệt',
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
    record_date DATE NOT NULL,
    diagnosis TEXT,
    on_site_treatment TEXT,
    transferred_to TEXT,
    items_usage TEXT,
    FOREIGN KEY (student_id) REFERENCES student(id)
);

INSERT INTO daily_health_record (
    student_id, detect_time, record_date, diagnosis, on_site_treatment, transferred_to, items_usage
)
VALUES 
('211000', '2025-06-05', '2025-06-05', 'Chảy máu cam', 'Nằm nghỉ, nghiêng đầu về trước', NULL, 'Bông gòn'),
('211000', '2025-06-01', '2025-06-01', 'Đau mắt đỏ', 'Nhỏ mắt Natri Clorid 0.9%', NULL, 'Thuốc nhỏ mắt'),

('211001', '2025-06-04', '2025-06-04', 'Ho và sổ mũi', 'Uống thuốc ho thảo dược', NULL, 'Thuốc ho, giấy lau'),
('211001', '2025-06-02', '2025-06-02', 'Đau răng', 'Súc miệng nước muối, thông báo phụ huynh', NULL, 'Nước muối sinh lý'),

('211002', '2025-06-03', '2025-06-03', 'Ngã cầu thang nhẹ', 'Kiểm tra vết thương, theo dõi 15 phút', NULL, 'Băng dán, nước sát khuẩn'),
('211002', '2025-05-31', '2025-05-31', 'Sốt 38.5°C', 'Đặt khăn lạnh, uống hạ sốt', NULL, 'Paracetamol 250mg'),

('211003', '2025-06-06', '2025-06-06', 'Nổi mẩn đỏ toàn thân', 'Thông báo phụ huynh, theo dõi phản ứng', 'Trạm Y tế Phường 3', 'Kem chống ngứa'),
('211003', '2025-06-03', '2025-06-03', 'Khó tiêu', 'Uống men tiêu hóa', NULL, 'Men tiêu hóa gói');

-----------------------------------------------------------------------------------------END FLOW DaiLyHealthRecord


-----------------------------------------------------------------------------------------FLOW GIÁM SÁT BỆNH MÃN TÍNH VÀ BỆNH TRUYỀN NHIỄM
--------------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE disease_record (
    student_id VARCHAR(10) NOT NULL,
    disease_id INT NOT NULL,
    diagnosis TEXT,
    detect_date DATE,
    cure_date DATE,
    location_cure TEXT,
    transferred_to TEXT,
    status VARCHAR(50) CHECK (status IN ('RECOVERED', 'UNDER_TREATMENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (disease_id) REFERENCES disease(id),
    
    PRIMARY KEY (student_id, disease_id)
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
