const { google } = require('googleapis');

const SHEET_RANGE = process.env.SHEET_RANGE || 'Invitados!A:E';

function normalizePhone(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}

function validate(payload) {
  const errors = [];
  const name = String(payload.name || '').trim();
  const phoneRaw = String(payload.phone || '').trim();
  const phone = normalizePhone(phoneRaw);
  const guests = parseInt(payload.guests, 10);
  const message = String(payload.message || '').trim();

  if (name.length < 2 || name.length > 120) {
    errors.push('El nombre debe tener entre 2 y 120 caracteres.');
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

  return { errors, data: { name, phone, guests, message } };
}

async function appendRow({ name, phone, guests, message }) {
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

  const timestamp = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: SHEET_RANGE,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[timestamp, name, phone, guests, message]]
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