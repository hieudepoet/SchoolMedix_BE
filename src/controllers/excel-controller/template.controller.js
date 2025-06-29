import {
      ADMIN_IMPORT_TEMPLATE,
      NURSE_IMPORT_TEMPLATE,
      PARENT_IMPORT_TEMPLATE,
      STUDENT_IMPORT_TEMPLATE,
      STUDENT_PARENT_IMPORT_TEMPLATE
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

export function getNurseTemplate(req, res) {
      try {
            res.json({
                  error: false,
                  data: NURSE_IMPORT_TEMPLATE,
            });
      } catch (error) {
            console.error('Lỗi khi lấy nurse template:', error);
            res.status(500).json({
                  error: true,
                  message: 'Không thể lấy template nurse',
            });
      }
}

export function getParentTemplate(req, res) {
      try {
            res.json({
                  error: false,
                  data: PARENT_IMPORT_TEMPLATE,
            });
      } catch (error) {
            console.error('Lỗi khi lấy parent template:', error);
            res.status(500).json({
                  error: true,
                  message: 'Không thể lấy template parent',
            });
      }
}

export function getStudentTemplate(req, res) {
      try {
            res.json({
                  error: false,
                  data: STUDENT_IMPORT_TEMPLATE,
            });
      } catch (error) {
            console.error('Lỗi khi lấy student template:', error);
            res.status(500).json({
                  error: true,
                  message: 'Không thể lấy template student',
            });
      }
}

export function getStudentParentTemplate(req, res) {
      try {
            res.json({
                  error: false,
                  data: STUDENT_PARENT_IMPORT_TEMPLATE,
            });
      } catch (error) {
            console.error('Lỗi khi lấy student-parent template:', error);
            res.status(500).json({
                  error: true,
                  message: 'Không thể lấy template student-parent',
            });
      }
}
