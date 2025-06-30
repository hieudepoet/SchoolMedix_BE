
export const ADMIN_IMPORT_TEMPLATE = { 
      COLUMN: {
            name: {
                  col_name: "Tên quản trị viên",
                  data_type: "Text",
                  required: true,
            },
            email: {
                  col_name: "Email",
                  data_type: "Text",
                  required: false,
            },
            dob: {
                  col_name: "Ngày sinh",
                  data_type: "Date",
                  required: true,
            },
            address: {
                  col_name: "Địa chỉ",
                  data_type: "Text",
                  required: true,
            },
            isMale: {
                  col_name: "Giới tính (Nam=true, Nữ=false)",
                  data_type: "True/False",
                  required: true,
            },
            phone_number: {
                  col_name: "Số điện thoại",
                  data_type: "Text",
                  required: false,
            },
            profile_img_url: {
                  col_name: "Link ảnh đại diện",
                  data_type: "URL Text",
                  required: false,
            },
      },
};
ADMIN_IMPORT_TEMPLATE.TOTAL_FIELD_NEEDED = Object.keys(ADMIN_IMPORT_TEMPLATE.COLUMN).length;



export const NURSE_IMPORT_TEMPLATE = {
      COLUMN: {
            name: {
                  col_name: "Tên y tá",
                  data_type: "Text",
                  required: true,
            },
            email: {
                  col_name: "Email",
                  data_type: "Text",
                  required: false,
            },
            dob: {
                  col_name: "Ngày sinh",
                  data_type: "Date",
                  required: true,
            },
            address: {
                  col_name: "Địa chỉ",
                  data_type: "Text",
                  required: true,
            },
            isMale: {
                  col_name: "Giới tính (Nam=true, Nữ=false)",
                  data_type: "True/False",
                  required: true,
            },
            phone_number: {
                  col_name: "Số điện thoại",
                  data_type: "Text",
                  required: false,
            },
            profile_img_url: {
                  col_name: "Link ảnh đại diện",
                  data_type: "URL Text",
                  required: false,
            },
      },
};
NURSE_IMPORT_TEMPLATE.TOTAL_FIELD_NEEDED = Object.keys(NURSE_IMPORT_TEMPLATE.COLUMN).length;



export const PARENT_IMPORT_TEMPLATE = {
      COLUMN: {
            name: {
                  col_name: "Tên phụ huynh",
                  data_type: "Text",
                  required: true,
            },
            email: {
                  col_name: "Email",
                  data_type: "Text",
                  required: false,
            },
            dob: {
                  col_name: "Ngày sinh",
                  data_type: "Date",
                  required: true,
            },
            address: {
                  col_name: "Địa chỉ",
                  data_type: "Text",
                  required: true,
            },
            isMale: {
                  col_name: "Giới tính (Nam=true, Nữ=false)",
                  data_type: "True/False",
                  required: true,
            },
            phone_number: {
                  col_name: "Số điện thoại",
                  data_type: "Text",
                  required: false,
            },
            profile_img_url: {
                  col_name: "Link ảnh đại diện",
                  data_type: "URL Text",
                  required: false,
            },
      },
};
PARENT_IMPORT_TEMPLATE.TOTAL_FIELD_NEEDED = Object.keys(PARENT_IMPORT_TEMPLATE.COLUMN).length;



export const STUDENT_IMPORT_TEMPLATE = {
      COLUMN: {
            name: {
                  col_name: "Tên học sinh",
                  data_type: "Text",
                  required: true,
            },
            email: {
                  col_name: "Email học sinh",
                  data_type: "Text",
                  required: false,
            },
            dob: {
                  col_name: "Ngày sinh",
                  data_type: "Date",
                  required: true,
            },
            address: {
                  col_name: "Địa chỉ",
                  data_type: "Text",
                  required: true,
            },
            class_id: {
                  col_name: "Mã lớp",
                  data_type: "Text",
                  required: true,
            },
            mom_id: {
                  col_name: "ID mẹ",
                  data_type: "Số",
                  required: false,
            },
            dad_id: {
                  col_name: "ID bố",
                  data_type: "Số",
                  required: false,
            },
            year_of_enrollment: {
                  col_name: "Năm nhập học",
                  data_type: "Số",
                  required: true,
            },
            isMale: {
                  col_name: "Giới tính (Nam=true, Nữ=false)",
                  data_type: "True/False",
                  required: true,
            },
            phone_number: {
                  col_name: "Số điện thoại",
                  data_type: "Text",
                  required: false,
            },
            profile_img_url: {
                  col_name: "Link ảnh đại diện",
                  data_type: "URL Text",
                  required: false,
            },
      },
};
STUDENT_IMPORT_TEMPLATE.TOTAL_FIELD_NEEDED = Object.keys(STUDENT_IMPORT_TEMPLATE.COLUMN).length;


// template for adding both parent and student
export const STUDENT_PARENT_IMPORT_TEMPLATE = {
      COLUMN: {
            // 👶 Học sinh
            student_name: {
                  col_name: "Tên học sinh",
                  data_type: "Text",
                  required: true,
            },
            student_email: {
                  col_name: "Email học sinh",
                  data_type: "Text",
                  required: false,
            },
            student_dob: {
                  col_name: "Ngày sinh học sinh",
                  data_type: "Date",
                  required: true,
            },
            student_address: {
                  col_name: "Địa chỉ học sinh",
                  data_type: "Text",
                  required: true,
            },
            class_id: {
                  col_name: "Mã lớp",
                  data_type: "Text",
                  required: true,
            },
            year_of_enrollment: {
                  col_name: "Năm nhập học",
                  data_type: "Số",
                  required: true,
            },
            student_isMale: {
                  col_name: "Giới tính học sinh (Nam=true, Nữ=false)",
                  data_type: "True/False",
                  required: true,
            },
            student_phone_number: {
                  col_name: "Số điện thoại",
                  data_type: "Text",
                  required: false,
            },
            student_profile_img_url: {
                  col_name: "Link ảnh đại diện của học sinh",
                  data_type: "URL Text",
                  required: false,
            },

            // 👨 Bố
            dad_name: {
                  col_name: "Tên bố",
                  data_type: "Text",
                  required: true,
            },
            dad_email: {
                  col_name: "Email bố",
                  data_type: "Text",
                  required: false,
            },
            dad_dob: {
                  col_name: "Ngày sinh bố",
                  data_type: "Date",
                  required: true,
            },
            dad_address: {
                  col_name: "Địa chỉ bố",
                  data_type: "Text",
                  required: true,
            },
            dad_phone_number: {
                  col_name: "SĐT bố",
                  data_type: "Text",
                  required: false,
            },
            dad_profile_img_url: {
                  col_name: "Link ảnh đại diện của bố",
                  data_type: "URL Text",
                  required: false,
            },

            // 👩 Mẹ
            mom_name: {
                  col_name: "Tên mẹ",
                  data_type: "Text",
                  required: true,
            },
            mom_email: {
                  col_name: "Email mẹ",
                  data_type: "Text",
                  required: false,
            },
            mom_dob: {
                  col_name: "Ngày sinh mẹ",
                  data_type: "Date",
                  required: true,
            },
            mom_address: {
                  col_name: "Địa chỉ mẹ",
                  data_type: "Text",
                  required: true,
            },
            mom_phone_number: {
                  col_name: "SĐT mẹ",
                  data_type: "Text",
                  required: false,
            },
            mom_profile_img_url: {
                  col_name: "Link ảnh đại diện của mẹ",
                  data_type: "URL Text",
                  required: false,
            },
      },
};
STUDENT_PARENT_IMPORT_TEMPLATE.TOTAL_FIELD_NEEDED = Object.keys(STUDENT_PARENT_IMPORT_TEMPLATE.COLUMN).length;

