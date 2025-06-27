import {
      ADMIN_IMPORT_TEMPLATE, NURSE_IMPORT_TEMPLATE, PARENT_IMPORT_TEMPLATE, STUDENT_IMPORT_TEMPLATE, STUDENT_PARENT_IMPORT_TEMPLATE

} from "../../services/excel/index.js";

export function getAdminTemplate(req, res) {
      try {
            res.json({
                  error: false,
                  data: ADMIN_IMPORT_TEMPLATE,
            });
      } catch (error) {
            console.error('Lỗi khi lấy admin template:', error);
            res.status(500).json({
                  error: true,
                  message: 'Không thể lấy template admin',
            });
      }
}

