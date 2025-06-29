export function generateHealthRecordsHtmlFromJson(record) {
      console.log(record);
      const rowsHtml = Object.entries(record).map(([key, value]) => `
    <tr>
      <th>${key}</th>
      <td>${value ?? ''}</td>
    </tr>
  `).join('');

      const recordId = record["Mã hồ sơ"] || record["Mã khám"] || Object.values(record)[0] || "Không rõ";

      return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          h2 {
            text-align: center;
            margin-bottom: 12px;
          }
          h3 {
            text-align: center;
            margin-bottom: 24px;
            font-weight: normal;
            color: #555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }
          th {
            width: 30%;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <h2>Phiếu Kết Quả Khám Sức Khỏe</h2>
        <h3>Mã hồ sơ: ${recordId}</h3>
        <table>
          ${rowsHtml}
        </table>
      </body>
    </html>
  `;
}
