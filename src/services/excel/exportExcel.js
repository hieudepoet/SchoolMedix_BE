import ExcelJS from 'exceljs';

export async function exportExcel(headers = [], rows = [], sheetName = 'Sheet1', filePath) {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(sheetName);

      // Add headers
      let headerRow;
      if (headers.length > 0) {
            headerRow = sheet.addRow(headers);

            // Apply style to header cells
            headerRow.eachCell(cell => {
                  cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD9D9D9' } // Gray background
                  };
                  cell.font = {
                        bold: true,
                        color: { argb: 'FF000000' } // Black text
                  };
                  cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
      }

      // Add data rows
      rows.forEach(row => sheet.addRow(row));

      // Auto column width
      sheet.columns.forEach((col, i) => {
            col.width = headers[i]?.length > 12 ? headers[i].length + 5 : 15;
      });

      await workbook.xlsx.writeFile(filePath);
}

function generateExcelTemplate(template, sheetName = 'Sheet1') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(sheetName);

      const columnDefs = Object.entries(template.COLUMN).map(([key, value]) => ({
            header: value.col_name,
            key,
            width: Math.max(value.col_name.length, 20),
      }));

      sheet.columns = columnDefs;
      return workbook.xlsx.writeBuffer();
}