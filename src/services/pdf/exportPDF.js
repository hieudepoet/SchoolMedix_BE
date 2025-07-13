import puppeteer from 'puppeteer';
import fs from "fs"
import { generateHealthRecordsHtmlFromJson, generateFinalHealthReportHTML } from "./templates/utils.js"


export async function generatePDFBufferFromHealthRecord(record) {
      const header = Object.keys(record);
      const data = [record]; // gói thành 1 mảng

      const html = generateHealthRecordsHtmlFromJson(record);

      const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

      await browser.close();
      return pdfBuffer;
}

export async function generatePDFBufferForFinalHealthReport(campaign_info, student_profile, general_health, specialist_exam_records) {
      const html = await generateFinalHealthReportHTML(campaign_info, student_profile, general_health, specialist_exam_records);

      const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

      await browser.close();
      return Buffer.from(pdfBuffer);
}
