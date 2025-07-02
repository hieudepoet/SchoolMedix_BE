import ExcelJS from 'exceljs';

export async function exportExcelToBuffer(headers = [], rows = [], sheetName = 'Sheet1') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(sheetName);

      // Add headers
      let headerRow;
      if (headers.length > 0) {
            headerRow = sheet.addRow(headers);
      }

      // Add data rows
      rows.forEach(row => sheet.addRow(row));

      // Auto column width
      sheet.columns.forEach((col, i) => {
            col.width = headers[i]?.length > 12 ? headers[i].length + 5 : 15;
      });

      // Return buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
}


