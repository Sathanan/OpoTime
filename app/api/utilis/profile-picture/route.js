import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uploadDir = path.join(process.cwd(), '/public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ message: 'Keine Bilddaten gefunden' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Base64-Daten parsen
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return new Response(
        JSON.stringify({ message: 'Ungültiges Base64 Format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ext = matches[1].split('/')[1]; // z.B. png, jpeg
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    // Dateinamen erzeugen
    const filename = uuidv4() + '.' + ext;
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, buffer);

    return new Response(
      JSON.stringify({ imageUrl: `/uploads/${filename}` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload Fehler:', error);
    return new Response(
      JSON.stringify({ message: 'Upload fehlgeschlagen' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
