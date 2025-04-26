import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import pdf from 'pdf-parse';
import { runAgent } from '../../lib/agent-engine';

export const config = {
  api: {
    bodyParser: false,
  },
};

// ----- MOCK OUTPUT GENERATORS -----
function generateMockSummary(text, style) {
  return `📌 Style: ${style.toUpperCase()}\n\nMock summary:\n${text.slice(0, 300)}...\n`;
}

function generateMockKpiSummary(records, style) {
  return `📊 Style: ${style.toUpperCase()}\n\n- Rows: ${records.length}\n- Columns: ${Object.keys(records[0] || {}).join(', ')}`;
}

function generateMockPdfSummary(text, style) {
  return `📄 Style: ${style.toUpperCase()}\n\n${text.slice(0, 300)}...`;
}

// ----- HANDLER -----
export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ keepExtensions: true, multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Form parse error:', err);
      return res.status(400).json({ error: 'File upload failed' });
    }

    const style = fields.style || 'donor';
    const email = fields.email || '';
    const fileArray = Object.values(files || {});
    let report = '';

    if (!fileArray.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    for (const fileList of fileArray) {
      const file = Array.isArray(fileList) ? fileList[0] : fileList;
      const ext = file.originalFilename?.split('.').pop()?.toLowerCase();
      const mime = file.mimetype;
      const path = file.filepath;

      if (!path || typeof path !== 'string') {
        console.warn('⚠️ Missing or invalid filepath:', file);
        continue;
      }

      try {
        if (mime === 'text/csv' || ext === 'csv') {
          const csv = fs.readFileSync(path, 'utf8');
          const records = parse(csv, { columns: true, skip_empty_lines: true });
          report += generateMockKpiSummary(records, style) + '\n\n';

        } else if (mime === 'application/pdf' || ext === 'pdf') {
          const buffer = fs.readFileSync(path);
          const data = await pdf(buffer);
          report += generateMockPdfSummary(data.text, style) + '\n\n';

        } else {
          const txt = fs.readFileSync(path, 'utf8');
          report += generateMockSummary(txt, style) + '\n\n';
        }
      } catch (readErr) {
        console.error(`❌ Failed to process ${file.originalFilename}:`, readErr);
        report += `❌ Could not read file: ${file.originalFilename}\n\n`;
      }
    }

    if (email) {
      console.log(`📧 (Mock) Sending report to ${email}`);
    }

    return res.status(200).json({
      report,
      meta: {
        fileCount: fileArray.length,
        style,
        email,
      },
    });
  });
}