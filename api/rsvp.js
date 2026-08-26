const { google } = require('googleapis');

const SHEET_RANGE = process.env.SHEET_RANGE || 'BaseDatos!A:D';

function normalizePhone(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}

function validate(payload) {
  const errors = [];
  const name = String(payload.name || '').trim();
  const doc = String(payload.doc || '').trim();
  const phoneRaw = String(payload.phone || '').trim();
  const phone = normalizePhone(phoneRaw);
  const guests = parseInt(payload.guests, 10);
  const message = String(payload.message || '').trim();

  if (name.length < 2 || name.length > 120) {
    errors.push('El nombre debe tener entre 2 y 120 caracteres.');
  }
  if (doc.length < 3 || doc.length > 20) {
    errors.push('El documento debe tener entre 3 y 20 caracteres.');
  }
  if (!/^\+?[0-9][0-9\s-]{6,19}$/.test(phoneRaw)) {
    errors.push('El teléfono no es válido.');
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
    errors.push('El número de invitados debe estar entre 1 y 10.');
  }
  if (message.length > 500) {
    errors.push('El mensaje no puede superar los 500 caracteres.');
  }

  return { errors, data: { name, doc, phone, guests, message } };
}

async function appendRow({ name, doc, phone, guests, message }) {
  const credentialsRaw = process.env.GOOGLE_SERVICE_ACCOUNT;
  const spreadsheetId = process.env.SHEET_ID;

  if (!credentialsRaw || !spreadsheetId) {
    throw new Error('Faltan variables de entorno GOOGLE_SERVICE_ACCOUNT o SHEET_ID.');
  }

  const credentials = JSON.parse(credentialsRaw);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Verificar si la hoja BaseDatos existe, si no crearla con encabezados
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetsList = spreadsheet.data.sheets || [];
  const baseDatosSheet = sheetsList.find(
    (sheet) => sheet.properties.title === 'BaseDatos'
  );

  if (!baseDatosSheet) {
    // Crear la hoja BaseDatos
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: 'BaseDatos'
              }
            }
          }
        ]
      }
    });

    // Agregar encabezados
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'BaseDatos!A1:D1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['Nombre Completo', 'Documento', 'Invitados', 'Celular']]
      }
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: SHEET_RANGE,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[name, doc, guests, phone]]
    }
  });
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  let body = {};
  try {
    body =
      typeof req.body === 'object' && req.body !== null
        ? req.body
        : JSON.parse(req.body || '{}');
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ ok: false, error: 'JSON inválido.' });
  }

  const { errors, data } = validate(body);
  if (errors.length) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ ok: false, errors });
  }

  try {
    await appendRow(data);
  } catch (err) {
    console.error('Error al escribir en Google Sheets:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ ok: false, error: 'No se pudo guardar. Intenta de nuevo.' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ ok: true });
};