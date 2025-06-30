import ExcelJS from 'exceljs';

export async function excelToJson(fileBuffer) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer); // Dùng luôn buffer

      const worksheet = workbook.worksheets[0];
      const headers = [];
      const data = [];

      worksheet.eachRow((row, rowIndex) => {
            const values = row.values.slice(1);
            if (rowIndex === 1) {
                  headers.push(...values);
            } else {
                  const rowData = {};
                  values.forEach((cell, i) => {
                        rowData[headers[i]] = cell;
                  });
                  data.push(rowData);
            }
      });

      return data;
}
