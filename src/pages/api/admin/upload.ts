import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure the upload directory is within the `public` folder
const uploadDir = path.join(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing the files' });
    }
  
    let file: formidable.File | undefined;
    if (Array.isArray(files.file)) {
      file = files.file[0] as formidable.File;
    } else if (files.file) {
      file = files.file as formidable.File;
    }

    const filePath = file?.filepath;

    res.status(200).json({
      imageUrl: filePath ? `/uploads/${path.basename(filePath)}` : null,
    });
  });
};

export default handler;
