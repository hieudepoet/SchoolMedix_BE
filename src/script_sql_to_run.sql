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
  gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ')) not null,
  address TEXT not null,
  phone_number VARCHAR(20),
  profile_img_url TEXT,
  email_confirmed BOOLEAN DEFAULT false not null
);
-- start admin id from 100000
ALTER SEQUENCE admin_id_seq RESTART WITH 100000;

INSERT INTO Admin (
  supabase_uid,
  email,
  name,
  dob,
  gender,
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
  'Nam',
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
  gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ')) not null,
  address TEXT not null,
  phone_number VARCHAR(20),
  profile_img_url TEXT,
  email_confirmed BOOLEAN DEFAULT false not null
);
-- start nurse id from 100000
ALTER SEQUENCE nurse_id_seq RESTART WITH 100000;

INSERT INTO Nurse (
  supabase_uid,
  email,
  name,
  dob,
  gender,
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
  'Nữ',
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
  gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ')) not null,
  address TEXT not null,
  phone_number VARCHAR(20),
  profile_img_url TEXT,
  email_confirmed BOOLEAN DEFAULT false not null
);

-- start parent id from 100000
ALTER SEQUENCE parent_id_seq RESTART WITH 100000;

INSERT INTO parent (
  supabase_uid, email, name, dob, gender, address, phone_number, profile_img_url, email_confirmed
) VALUES
  (
    'be258789-4fe3-421c-baed-53ef3ed87f3b',
    'phamthanhqb2005@gmail.com',
    'Mai Nguyễn Duy Khánh',
    '1989-03-10',
    'Nam',
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
    'Nam',
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
    'Nam',
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
    'Nam',
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
        gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ')) not null,
        address TEXT not null,
        phone_number VARCHAR(20),
        profile_img_url TEXT,
        year_of_enrollment int not null,
        email_confirmed BOOLEAN DEFAULT false not null,
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
  gender,
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
  'Nam',
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
  'Nữ',
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
  'Nam',
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
  'Nữ',
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

INSERT INTO CheckupCampaign (name, description, location, start_date, end_date, status) VALUES
('Khám sức khỏe định kỳ học sinh năm 2025', 'Chiến dịch khám sức khỏe tổng quát cho toàn bộ học sinh trong trường. Thời gian dự kiến: 8h sáng.', 'nhà đà năng tầng 4', '2025-09-01', '2025-09-10', 'CANCELLED'),
('Định kỳ + Khám mắt và răng học sinh', 'Khám chuyên sâu về mắt và răng, phối hợp với phòng khám chuyên khoa. Thời gian dự kiến: 8h sáng ngày 5/10/25', 'sân trường', '2025-10-05', '2025-10-12', 'DONE'),
('Khám tâm lý học đường', 'Tư vấn và hỗ trợ tâm lý cho học sinh cần thiết', 'sân trường', '2025-08-15', '2025-08-20', 'PREPARING');

CREATE TABLE SpecialistExamList (
	id serial primary key,
	name VARCHAR(100) NOT NULL,
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

INSERT INTO CheckupRegister (campaign_id, student_id, submit_by, reason, status) VALUES
(1, '211000', 100002, 'Đăng ký khám mắt và răng', 'CANCELLED'),
(1, '211001', 100000, 'Hỗ trợ tư vấn tâm lý', 'CANCELLED'),
(1, '211002', 100001, 'Khám sinh dục tuổi dậy thì', 'CANCELLED'),
(1, '211003', 100002, 'Đăng ký khám tổng quát', 'CANCELLED'),
(2, '211000', 100000, 'Đăng ký khám mắt định kỳ', 'PENDING'),
(2, '211001', 100001, 'Tư vấn tâm lý bổ sung', 'PENDING'),
(2, '211002', 100003, 'Khám sinh dục bổ sung', 'SUBMITTED'),
(2, '211003', 100000, 'Khám tổng quát lần 2', 'SUBMITTED'),
(3, '211000', 100003, 'Hỗ trợ tâm lý bổ sung', 'PENDING'),
(3, '211001', 100001, 'Đăng ký khám mắt', 'SUBMITTED'),
(3, '211002', 100000, 'Khám sức khỏe định kỳ', 'SUBMITTED'),
(3, '211003', 100002, 'Khám sinh dục bổ sung', 'SUBMITTED');


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
    register_id, height, weight, blood_pressure,
    left_eye, right_eye, ear, nose, throat,
    teeth, gums, skin_condition, heart, lungs,
    spine, posture, final_diagnosis, is_checked,status
) VALUES
(5, '150cm', '40kg', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Hồng hào', 'Không mẩn đỏ', 'Bình thường', 'Bình thường', 'Thẳng', 'Bình thường', 'Sức khỏe tốt',TRUE, 'DONE'),
(6, '155cm', '42kg', '105/70', '10/10', '9/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Răng hơi sâu', 'Bình thường', 'Không có vấn đề', 'Bình thường', 'Bình thường', 'Hơi lệch', 'Tư thế tốt', 'Cần theo dõi tâm lý', TRUE,'DONE'),
(7, '152cm', '41kg', '100/65', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi đỏ', 'Bình thường', 'Bình thường', 'Da nhạy cảm', 'Tốt', 'Bình thường', 'Thẳng', 'Bình thường', 'Tạm hoãn do lý do cá nhân', TRUE,'DONE'),
(8, '149cm', '39kg', '115/75', '9/10', '9/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Bình thường', 'Không mẩn', 'Bình thường', 'Bình thường', 'Bình thường', 'Bình thường', 'Khuyến cáo bổ sung dinh dưỡng',TRUE, 'DONE');

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
(5, 2, 'Bình thường', 'Sức khỏe sinh dục tốt, không có bất thường', 'http://example.com/doc1.pdf',TRUE, 'DONE'),
(6, 2, 'Ổn định', 'Tâm lý ổn định, không có dấu hiệu lo âu hay trầm cảm', 'http://example.com/doc2.pdf',TRUE, 'DONE'),
(7, 2, 'Không có dấu hiệu', 'Không phát hiện rối loạn tâm thần', 'http://example.com/doc3.pdf', TRUE,'DONE'),
(8, 2, 'Bình thường', 'Sức khỏe sinh dục bình thường, chưa phát hiện bất thường', 'http://example.com/doc4.pdf',TRUE, 'DONE');

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
('Bệnh truyền nhiễm', 'Bạch hầu, Ho gà, Uốn ván', 'Nhóm ba bệnh truyền nhiễm nguy hiểm, thường được tiêm cùng trong một mũi.', true, 3),
('Bệnh truyền nhiễm', 'Bại liệt', 'Virus tấn công hệ thần kinh, gây liệt vĩnh viễn.', true, 3),
('Bệnh truyền nhiễm', 'Viêm phổi, viêm màng não mủ do Hib', 'Do vi khuẩn Hib gây ra, ảnh hưởng đường hô hấp và thần kinh.', true, 3),
('Bệnh truyền nhiễm', 'Tiêu chảy do Rotavirus', 'Gây tiêu chảy cấp nguy hiểm ở trẻ nhỏ.', true, 2),
('Bệnh truyền nhiễm', 'Viêm phổi, viêm màng não, viêm tai giữa do phế cầu khuẩn', 'Do phế cầu gây ra, ảnh hưởng hô hấp và thần kinh.', true, 3),
('Bệnh truyền nhiễm', 'Viêm màng não, nhiễm khuẩn huyết, viêm phổi do não mô cầu khuẩn nhóm B', 'Do vi khuẩn não mô cầu B, gây tổn thương nặng nề cho trẻ.', true, 2),
('Bệnh truyền nhiễm', 'Viêm màng não, nhiễm khuẩn huyết, viêm phổi do não mô cầu khuẩn B,C', 'Gây bệnh nặng toàn thân, cần tiêm phòng sớm.', true, 2),
('Bệnh truyền nhiễm', 'Cúm', 'Gây sốt cao, ho và suy hô hấp, đặc biệt ở trẻ nhỏ.', true, 1),
('Bệnh truyền nhiễm', 'Viêm màng não, nhiễm khuẩn huyết, viêm phổi do não mô cầu khuẩn A,C,Y,W-135', 'Các chủng vi khuẩn não mô cầu nguy hiểm, dễ lây lan.', true, 1),
('Bệnh truyền nhiễm', 'Viêm não Nhật Bản (vắc xin bất hoạt não chuột)', 'Vaccine truyền thống phòng bệnh viêm não Nhật Bản.', true, 2),
('Bệnh truyền nhiễm', 'Viêm não Nhật Bản (vắc xin bất hoạt tế bào Vero)', 'Dạng vaccine hiện đại hơn phòng viêm não Nhật Bản.', true, 2),
('Bệnh truyền nhiễm', 'Viêm não Nhật Bản (vắc xin sống giảm độc lực tái tổ hợp)', 'Vaccine sống phòng viêm não Nhật Bản, hiệu quả dài lâu.', true, 1),
('Bệnh truyền nhiễm', 'Sởi, Quai bị, Rubella (Priorix)', 'Vaccine kết hợp phòng 3 bệnh truyền nhiễm thường gặp.', true, 2),
('Bệnh truyền nhiễm', 'Sởi, Quai bị, Rubella (MMR II)', 'Vaccine kết hợp MMR II phòng sởi, quai bị, rubella.', true, 2),
('Bệnh truyền nhiễm', 'Thủy đậu', 'Gây mụn nước toàn thân, dễ lây lan.', true, 2),
('Bệnh truyền nhiễm', 'Viêm gan A', 'Lây qua đường tiêu hóa, gây tổn thương gan.', true, 1),
('Bệnh truyền nhiễm', 'Viêm gan A+B', 'Vaccine kết hợp phòng cả viêm gan A và B.', true, 3),
('Bệnh truyền nhiễm', 'Thương hàn', 'Gây sốt kéo dài, lây qua thực phẩm nhiễm khuẩn.', true, 1),
('Bệnh truyền nhiễm', 'Tả', 'Bệnh tiêu chảy cấp tính nguy hiểm do vi khuẩn tả.', true, 2),
('Bệnh truyền nhiễm', 'Sốt xuất huyết', 'Lây qua muỗi, gây xuất huyết nội tạng nguy hiểm.', true, 1),
('Bệnh truyền nhiễm', 'Dại', 'Virus dại gây viêm não cấp, luôn tử vong nếu không tiêm kịp thời.', true, 4),

-- Bệnh mãn tính, cần vaccine
('Bệnh mãn tính', 'Viêm gan B', 'Bệnh về gan lây qua máu, có thể thành mãn tính.', true, 3),
('Bệnh mãn tính', 'Bạch hầu', 'Nhiễm khuẩn nghiêm trọng ảnh hưởng đến hô hấp.', true, 2),
('Bệnh mãn tính', 'Hen suyễn', 'Bệnh hô hấp mãn tính, kiểm soát bằng thuốc chứ không vaccine.', false, 0),
('Bệnh mãn tính', 'Béo phì', 'Bệnh gây chậm chạp và bệnh nền nguyên nhân của các bệnh khác', false, 0);


--vaccine
CREATE TABLE vaccine (
    id SERIAL PRIMARY KEY,
    disease_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (disease_id) REFERENCES disease(id)
);

INSERT INTO vaccine (disease_id, name, description) VALUES
(1, 'MVAX', 'Vaccine phòng bệnh Sởi - loại MVAX'),
(1, 'Priorix', 'Vaccine phòng bệnh Sởi - loại Priorix'),
(2, 'R-Vac', 'Vaccine phòng bệnh Rubella - loại R-Vac'),
(3, 'Varivax', 'Vaccine phòng bệnh Thủy đậu - loại Varivax'),
(3, 'Varilrix', 'Vaccine phòng bệnh Thủy đậu - loại Varilrix'),
(4, 'Engerix-B', 'Vaccine phòng bệnh Viêm gan B - loại Engerix-B'),
(4, 'Heplisav-B', 'Vaccine phòng bệnh Viêm gan B - loại Heplisav-B'),
(5, 'DTP', 'Vaccine phòng bệnh Bạch hầu - loại DTP'),
(5, 'Infanrix', 'Vaccine phòng bệnh Bạch hầu - loại Infanrix');

--vaccination_campaign
CREATE TABLE vaccination_campaign (
    id SERIAL PRIMARY KEY,
    vaccine_id INT NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PREPARING', 'UPCOMING', 'CANCELLED', 'ONGOING', 'COMPLETED')),
    FOREIGN KEY (vaccine_id) REFERENCES vaccine(id)
);

INSERT INTO vaccination_campaign (vaccine_id, description, location, start_date, end_date, status) VALUES
(1, 'Tiêm phòng bệnh Sởi (MVAX)', 'School Medix', '2025-06-15', '2025-06-17', 'COMPLETED'),
(2, 'Tiêm phòng bệnh Sởi (Priorix)', 'School Medix', '2025-06-01', '2025-06-20', 'PREPARING'),
(3, 'Tiêm phòng bệnh Rubella (R-Vac)', 'School Medix', '2025-06-22', '2025-06-24', 'CANCELLED'),
(4, 'Tiêm phòng bệnh Thủy đậu (Varivax)', 'School Medix', '2025-06-25', '2025-06-27', 'PREPARING');

-- (5, 'Tiêm phòng bệnh Thủy đậu (Varilrix)', 'School Medix', '2025-06-28', '2025-06-30', 'UPCOMING'),
-- (6, 'Tiêm phòng bệnh Viêm gan B (Engerix-B)', 'School Medix', '2025-07-01', '2025-07-03', 'UPCOMING'),
-- (7, 'Tiêm phòng bệnh Viêm gan B (Heplisav-B)', 'School Medix', '2025-07-04', '2025-07-06', 'UPCOMING'),
-- (8, 'Tiêm phòng bệnh Bạch hầu (DTP)', 'School Medix', '2025-07-07', '2025-07-09', 'UPCOMING'),
-- (9, 'Tiêm phòng bệnh Bạch hầu (Infanrix)', 'School Medix', '2025-07-10', '2025-07-12', 'UPCOMING');

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
    '2025-06-15',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211000',
    null,
    2,
    '2025-06-15',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'CANCELLED'
  ),
  (
    '211000',
    1,
    2,
    '2025-06-15',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211002',
    3,
    1,
    '2025-06-16',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211003',
    4,
    1,
    '2025-06-17',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211002',
    3,
    3,
    '2025-06-20',
    'Tiêm vaccine Rubella phòng phát ban và sốt nhẹ',
    'School Medix',
    'COMPLETED'
  ),
  (
    '211001',
    2,
    3,
    '2025-06-22',
    'Tiêm vaccine Thủy đậu đã bị hủy do lý do sức khỏe',
    'School Medix',
    'CANCELLED'
  ),
  (
    '211003',
    4,
    4,
    '2025-06-25',
    'Không đến tiêm vaccine Viêm gan B',
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


