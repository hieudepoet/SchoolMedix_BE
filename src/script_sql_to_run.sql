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


-- Parent
CREATE TABLE Parent (
      id serial PRIMARY KEY,
	  supabase_uid uuid unique not null
);
-- start parent id from 100000
ALTER SEQUENCE parent_id_seq RESTART WITH 100000;

--Student
CREATE TABLE Student (
      id serial PRIMARY KEY,
	  supabase_uid UUID unique not null,
      class_id INT REFERENCES class(id),
      mom_id int REFERENCES parent(id),
      dad_id int REFERENCES parent(id)
);
ALTER SEQUENCE student_id_seq RESTART WITH 100000;

INSERT INTO parent (supabase_uid) VALUES
  ('81705d11-3052-4d70-82f2-1c11e8077dbe'),
  ('00f7f4c0-4998-4593-b9c4-6b8d74596cd9'),
  ('3dfa7d35-7f0f-449f-afbf-bb6e420016d2'),
  ('be258789-4fe3-421c-baed-53ef3ed87f3b')

  ;


INSERT INTO student (supabase_uid, class_id, mom_id, dad_id)
VALUES
  ('550934ca-e6ee-456f-b40c-d7fdc173342b', 1, 100003, null),
  ('fc57f7ed-950e-46fb-baa5-7914798e9ae3', 2, 100003, 100002),
  ('1519af26-f341-471b-8471-ab33a061b657', 2, null, 100000),
  ('ab9f1dc3-8b35-4b0c-9327-f677c3247143', 2, 100001, 100000)
  ;


-------------------------FLOW SEND MEDICATION REQUEST 
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
	student_id int references student(id), 
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
    100000, -- student_id
    100003, -- create_by
    'Viêm dạ dày cấp',
    '2025-06-10',
    NULL,
    '2025-06-11',
    'Cần gửi thuốc sớm',
    'https://luatduonggia.vn/wp-content/uploads/2025/06/quy-dinh-ve-noi-dung-ke-don-thuoc1.jpg',
    'PROCESSING'
),
(
    100002,
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
    100001,
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

----End FLOW SEND MEDICATION REQUEST 

----FLOW CHECKUP CAMPAIGN
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
('Khám sức khỏe định kỳ học sinh năm 2025', 'Chiến dịch khám sức khỏe tổng quát cho toàn bộ học sinh trong trường. Thời gian dự kiến: 8h sáng.', 'nhà đà năng tầng 4', '2025-09-01', '2025-09-10', 'PREPARING'),
('Định kỳ + Khám mắt và răng học sinh', 'Khám chuyên sâu về mắt và răng, phối hợp với phòng khám chuyên khoa. Thời gian dự kiến: 8h sáng ngày 5/10/25', 'sân trường', '2025-10-05', '2025-10-12', 'UPCOMING'),
('Khám tâm lý học đường', 'Tư vấn và hỗ trợ tâm lý cho học sinh cần thiết', 'sân trường', '2025-08-15', '2025-08-20', 'ONGOING'),
('Khám sinh dục tuổi dậy thì', 'Khám và tư vấn sinh dục cho học sinh tuổi dậy thì với sự đồng ý của phụ huynh', 'Trường THCS GHI', '2025-07-01', '2025-07-05', 'DONE'),
('Chiến dịch khám tổng quát', 'Chiến dịch khám tổng quát bị hủy do điều kiện thời tiết', 'nhà đa năng', '2025-11-01', '2025-11-10', 'CANCELLED');


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

-- Ví dụ gán các loại khám cho chiến dịch khám sức khỏe định kỳ năm 2025 (id = 1)
INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(1, 1), -- Khám sinh dục
(1, 2), -- Khám tâm lý
(1, 3); -- Khám tâm thần

-- Gán loại khám mắt và răng cho chiến dịch thứ 2 (id = 2)
INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(2, 2); -- Khám tâm lý (ví dụ, hoặc bạn có thể thêm các chuyên khoa khác nếu có)

-- Gán khám tâm lý cho chiến dịch thứ 3 (id = 3)
INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(3, 2);

-- Gán khám sinh dục cho chiến dịch thứ 4 (id = 4)
INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(4, 1);

-- Chiến dịch thứ 5 (id = 5) có khám xâm lấn
INSERT INTO CampaignContainSpeExam (campaign_id, specialist_exam_id) VALUES
(5, 4);


CREATE TYPE register_status AS ENUM (
    'PENDING',
    'SUBMITTED',
    'CANCELLED'
);

CREATE TABLE CheckupRegister (
    id SERIAL PRIMARY KEY,
    campaign_id INT NOT NULL,
    student_id int NOT NULL,
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
(2, 100001, 100002, 'Đăng ký khám mắt và răng', 'PENDING'),
(3, 100002, 100000, 'Hỗ trợ tư vấn tâm lý', 'SUBMITTED'),
(4, 100003, 100001, 'Khám sinh dục tuổi dậy thì', 'CANCELLED'),
(1, 100001, 100002, 'Đăng ký khám tổng quát', 'SUBMITTED'),
(2, 100002, 100000, 'Đăng ký khám mắt định kỳ', 'PENDING'),
(3, 100003, 100001, 'Tư vấn tâm lý bổ sung', 'SUBMITTED'),
(4, 100000, 100003, 'Khám sinh dục bổ sung', 'PENDING'),
(1, 100003, 100000, 'Khám tổng quát lần 2', 'SUBMITTED'),
(3, 100000, 100003, 'Hỗ trợ tâm lý bổ sung', 'PENDING'),
(2, 100003, 100001, 'Đăng ký khám mắt', 'SUBMITTED'),
(1, 100002, 100000, 'Khám sức khỏe định kỳ', 'CANCELLED'),
(4, 100001, 100002, 'Khám sinh dục bổ sung', 'SUBMITTED'),
(2, 100000, 100003, 'Đăng ký khám răng định kỳ', 'SUBMITTED'),
(3, 100001, 100002, 'Tư vấn tâm lý học sinh', 'SUBMITTED');


create type health_record_status as enum ('WAITING', 'DONE');
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
	status health_record_status NOT NULL DEFAULT 'WAITING'
);

INSERT INTO HealthRecord (
    register_id, height, weight, blood_pressure,
    left_eye, right_eye, ear, nose, throat,
    teeth, gums, skin_condition, heart, lungs,
    spine, posture, final_diagnosis, status
) VALUES
(1, '150cm', '40kg', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Hồng hào', 'Không mẩn đỏ', 'Bình thường', 'Bình thường', 'Thẳng', 'Bình thường', 'Sức khỏe tốt', 'DONE'),
(2, '155cm', '42kg', '105/70', '10/10', '9/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Răng hơi sâu', 'Bình thường', 'Không có vấn đề', 'Bình thường', 'Bình thường', 'Hơi lệch', 'Tư thế tốt', 'Cần theo dõi tâm lý', 'DONE'),
(3, '152cm', '41kg', '100/65', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Hơi đỏ', 'Bình thường', 'Bình thường', 'Da nhạy cảm', 'Tốt', 'Bình thường', 'Thẳng', 'Bình thường', 'Tạm hoãn do lý do cá nhân', 'DONE'),
(4, '149cm', '39kg', '115/75', '9/10', '9/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Bình thường', 'Không mẩn', 'Bình thường', 'Bình thường', 'Bình thường', 'Bình thường', 'Khuyến cáo bổ sung dinh dưỡng', 'DONE'),
(5, '153cm', '43kg', '112/72', '8/10', '9/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Cao răng nhẹ', 'Bình thường', 'Không tổn thương', 'Tốt', 'Bình thường', 'Bình thường', 'Bình thường', 'Đăng ký khám mắt chuyên sâu', 'DONE'),
(6, '151cm', '40kg', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Răng đều', 'Bình thường', 'Không có mẩn đỏ', 'Bình thường', 'Bình thường', 'Thẳng', 'Tốt', 'Tư vấn tâm lý định kỳ', 'DONE'),
(7, '154cm', '42kg', '113/73', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Hồng hào', 'Không mẩn', 'Tốt', 'Tốt', 'Thẳng', 'Tốt', 'Chờ khám sinh dục', 'DONE'),
(8, '150cm', '40kg', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Hồng', 'Không vấn đề', 'Tốt', 'Tốt', 'Bình thường', 'Bình thường', 'Sức khỏe tốt', 'DONE'),
(9, '156cm', '45kg', '115/75', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Răng trắng', 'Hồng hào', 'Không tổn thương', 'Tốt', 'Tốt', 'Thẳng', 'Tư thế tốt', 'Tư vấn hỗ trợ tâm lý học đường', 'DONE'),
(10, '157cm', '46kg', '117/76', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Hồng', 'Không có vấn đề', 'Tốt', 'Tốt', 'Thẳng', 'Tư thế đúng', 'Không có vấn đề sức khỏe', 'DONE'),
(11, '155cm', '43kg', '113/74', '9/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Sâu răng nhẹ', 'Hồng', 'Da thường', 'Tốt', 'Tốt', 'Hơi cong', 'Cần chỉnh tư thế', 'Cần chăm sóc răng miệng', 'DONE'),
(12, '149cm', '39kg', '110/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Tốt', 'Bình thường', 'Da khô', 'Tốt', 'Tốt', 'Bình thường', 'Bình thường', 'Chưa cần can thiệp', 'DONE'),
(13, '152cm', '41kg', '112/72', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Bình thường', 'Không tổn thương', 'Tốt', 'Tốt', 'Bình thường', 'Bình thường', 'Sức khỏe học đường ổn định', 'DONE'),
(14, '154cm', '42kg', '113/70', '10/10', '10/10', 'Bình thường', 'Không viêm', 'Không viêm', 'Bình thường', 'Bình thường', 'Không mẩn', 'Tốt', 'Tốt', 'Thẳng', 'Tư thế tốt', 'Tâm lý học sinh tốt', 'DONE');


CREATE TYPE specialist_exam_record_status AS ENUM ('CANNOT_ATTACH', 'WAITING', 'DONE');
CREATE TABLE specialistExamRecord (
    register_id INT NOT NULL,
    spe_exam_id INT NOT NULL,
    result TEXT,
    diagnosis TEXT,
    diagnosis_paper_url VARCHAR(255),
    status specialist_exam_record_status NOT NULL DEFAULT 'CANNOT_ATTACH',
    PRIMARY KEY (register_id, spe_exam_id),
    FOREIGN KEY (register_id) REFERENCES CheckupRegister(id),
    FOREIGN KEY (spe_exam_id) REFERENCES SpecialistExamList(id)
);

INSERT INTO specialistExamRecord (
    register_id, 
    spe_exam_id,
    result,
    diagnosis,
    diagnosis_paper_url,
	status
) VALUES 
(4, 1, 'Bình thường', 'Sức khỏe sinh dục tốt, không có bất thường', 'http://example.com/doc1.pdf', 'DONE'),
(4, 2, 'Ổn định', 'Tâm lý ổn định, không có dấu hiệu lo âu hay trầm cảm', 'http://example.com/doc2.pdf', 'DONE'),
(4, 3, 'Không có dấu hiệu', 'Không phát hiện rối loạn tâm thần', 'http://example.com/doc3.pdf', 'DONE'),

(8, 1, 'Bình thường', 'Sức khỏe sinh dục bình thường, chưa phát hiện bất thường', 'http://example.com/doc4.pdf', 'DONE'),
(8, 2, 'Ổn định', 'Tâm lý ổn định, phản ứng tốt với các tình huống stress', 'http://example.com/doc5.pdf', 'DONE'),
(8, 3, 'Không có dấu hiệu', 'Tâm thần bình thường, không có biểu hiện bệnh lý', 'http://example.com/doc6.pdf', 'DONE');

INSERT INTO specialistExamRecord (
    register_id, 
    spe_exam_id,
    result,
    diagnosis,
    diagnosis_paper_url,
	status
) VALUES 
(12, 1, 'Phát hiện hẹp cổ tử cung', 'Cổ tử cung hẹp, cần theo dõi và điều trị tiếp', 'http://example.com/abnormal_doc1.pdf', 'DONE'),
(12, 2, 'Lo âu cao', 'Bệnh nhân có dấu hiệu lo âu mức độ trung bình, đề nghị tư vấn tâm lý', 'http://example.com/abnormal_doc2.pdf', 'DONE'),
(12, 3, 'Biểu hiện loạn thần nhẹ', 'Có biểu hiện rối loạn tâm thần nhẹ, cần theo dõi chặt chẽ', 'http://example.com/abnormal_doc3.pdf', 'DONE');


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
-- Bệnh truyền nhiễm, cần vaccine
('Bệnh truyền nhiễm', 'Sởi', 'Bệnh truyền nhiễm phổ biến ở trẻ em, có thể gây biến chứng nặng.', true, 2),
('Bệnh truyền nhiễm', 'Rubella', 'Gây phát ban và sốt nhẹ, ảnh hưởng đến thai phụ.', true, 1),
('Bệnh truyền nhiễm', 'Thủy đậu', 'Gây mụn nước toàn thân và lây lan mạnh.', true, 2),
('Bệnh truyền nhiễm', 'Tay chân miệng', 'Tay chân miệng description.', false, 0),

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
    student_id int NOT NULL,
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
(1, 100000, 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-10 08:00:00', 100003),

(1, 100001, 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-10 09:00:00', 100002),

(1, 100002, 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-11 08:30:00', 100000),

(1, 100003, 'Đăng ký theo yêu cầu của nhà trường', true, '2025-06-11 09:30:00', 100001);


--vacination_record
CREATE TABLE vaccination_record (
    id SERIAL PRIMARY KEY,
    student_id int NOT NULL,
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
    100000,
    1, -- Con Phúc
    1, -- vaccine_id cho bệnh Sởi
    '2025-06-15',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
      100000,
    null, -- Con Phúc
    2, -- vaccine_id cho bệnh Sởi
    '2025-06-15',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'CANCELLED'
  ),
  (
      100000,
    1, -- Con Đạt
    2,
    '2025-06-15',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
      100002,
    3, -- Con Tèo
    1,
    '2025-06-16',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
      100003,
    4, -- Con Bê
    1,      
    '2025-06-17',
    'Tiêm vaccine MVAX phòng bệnh Sởi',
    'School Medix',
    'COMPLETED'
  ),
  (
      100002,
    3, -- Con Tèo tiếp tục tiêm Rubella
    3, -- vaccine_id cho bệnh Rubella
    '2025-06-20',
    'Tiêm vaccine Rubella phòng phát ban và sốt nhẹ',
    'School Medix',
    'COMPLETED'
  ),
  (
      100001,
    2, -- Con Đạt hủy lịch tiêm Thủy đậu
    3,
    '2025-06-22',
    'Tiêm vaccine Thủy đậu đã bị hủy do lý do sức khỏe',
    'School Medix',
    'CANCELLED'
  ),
  (
      100003,
    4, -- Con Bê lỡ lịch tiêm Viêm gan B
    4,
    '2025-06-25',
    'Không đến tiêm vaccine Viêm gan B',
    'School Medix',
    'COMPLETED'
  );


-------END FLOW VACCINATION


-------FLOW DaiLyHealthRecord
CREATE TABLE daily_health_record (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
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
-- student_id: 100000
(100000, '2025-06-05', '2025-06-05', 'Chảy máu cam', 'Nằm nghỉ, nghiêng đầu về trước', NULL, 'Bông gòn'),
(100000, '2025-06-01', '2025-06-01', 'Đau mắt đỏ', 'Nhỏ mắt Natri Clorid 0.9%', NULL, 'Thuốc nhỏ mắt'),

-- student_id: 100001
(100001, '2025-06-04', '2025-06-04', 'Ho và sổ mũi', 'Uống thuốc ho thảo dược', NULL, 'Thuốc ho, giấy lau'),
(100001, '2025-06-02', '2025-06-02', 'Đau răng', 'Súc miệng nước muối, thông báo phụ huynh', NULL, 'Nước muối sinh lý'),

-- student_id: 100002
(100002, '2025-06-03', '2025-06-03', 'Ngã cầu thang nhẹ', 'Kiểm tra vết thương, theo dõi 15 phút', NULL, 'Băng dán, nước sát khuẩn'),
(100002, '2025-05-31', '2025-05-31', 'Sốt 38.5°C', 'Đặt khăn lạnh, uống hạ sốt', NULL, 'Paracetamol 250mg'),

-- student_id: 100003
(100003, '2025-06-06', '2025-06-06', 'Nổi mẩn đỏ toàn thân', 'Thông báo phụ huynh, theo dõi phản ứng', 'Trạm Y tế Phường 3', 'Kem chống ngứa'),
(100003, '2025-06-03', '2025-06-03', 'Khó tiêu', 'Uống men tiêu hóa', NULL, 'Men tiêu hóa gói');
-------END FLOW DaiLyHealthRecord


-------FLOW GIÁM SÁT BỆNH MÃN TÍNH VÀ BỆNH TRUYỀN NHIỄM
CREATE TABLE disease_record (
    student_id INT NOT NULL,
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
    
    PRIMARY KEY (student_id, disease_id) -- optional: ensure uniqueness per disease per student
);


INSERT INTO disease_record (
    student_id, disease_id, diagnosis, detect_date, cure_date, location_cure, transferred_to, status
)
VALUES
(100000, 1, 'Phát ban và sốt nhẹ', '2025-05-01', '2025-05-05', 'Trạm Y tế Quận 1', NULL, 'RECOVERED'),
(100001, 2, 'Ho và nổi mẩn nhẹ', '2025-04-10', NULL, 'Tự theo dõi tại nhà', NULL, 'UNDER_TREATMENT'),
(100002, 1, 'Sốt, viêm họng', '2025-03-15', '2025-03-20', 'Phòng khám Nhi', NULL, 'RECOVERED'),
(100003, 2, 'Cảm lạnh nhẹ', '2025-02-01', NULL, 'Nhà theo dõi', NULL, 'UNDER_TREATMENT'),

(100000, 3, 'Mụn nước toàn thân, ngứa', '2025-06-01', '2025-06-06', 'Bệnh viện Nhi Đồng 1', NULL, 'RECOVERED'),
(100001, 4, 'Phát ban tay chân, lở miệng', '2025-05-10', NULL, 'Nhà theo dõi', NULL, 'UNDER_TREATMENT'),
(100002, 5, 'Mệt mỏi, vàng da nhẹ', '2025-04-20', NULL, 'Trạm y tế phường 5', NULL, 'UNDER_TREATMENT'),
(100003, 6, 'Khó thở, đau họng nặng', '2025-03-25', '2025-04-01', 'Phòng khám chuyên khoa', NULL, 'RECOVERED'),
(100000, 7, 'Thở khò khè, cần dùng ống hít', '2025-01-12', NULL, 'Nhà theo dõi', NULL, 'UNDER_TREATMENT'),
(100001, 8, 'Cân nặng vượt chuẩn, bác sĩ tư vấn giảm cân', '2025-01-05', NULL, 'Bệnh viện dinh dưỡng', NULL, 'UNDER_TREATMENT');
