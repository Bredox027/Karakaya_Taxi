// Gemeinsame Hilfsfunktionen

const getEl = (id) => document.getElementById(id);
const getValue = (id) => getEl(id)?.value.trim() || '';

const setFieldStatus = (id, isValid) => {
  const el = getEl(id);
  if (!el) return;
  el.classList.toggle('error', !isValid);
  el.classList.toggle('success', isValid);
};

const showMessage = (msg, type = 'error') => {
  const el = getEl('formMsg');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'success' ? '#4caf50' : '#d32f2f';
  el.style.display = msg ? 'block' : 'none';
};

const isValidAustrianPostalCode = (zip) => {
  if (!/^[0-9]{4}$/.test(zip)) return false;
  const code = parseInt(zip);
  return code >= 1000 && code <= 9999;
};

const generateBookingText = (payload) => {
  const timestamp = new Date().toLocaleString('de-DE');
  const lines = [
    '====================================',
    'KARAKAYA BUCHUNGSBESTÄTIGUNG',
    '====================================',
    '',
    `Zeitstempel: ${timestamp}`,
    '',
    '--- FAHRTDETAILS ---',
    `Fahrtart: ${payload.rideType}`,
    `Abholort: ${payload.pickup} ${payload.pickupZip}`,
    `Zielort: ${payload.dropoff} ${payload.dropoffZip}`,
    `Datum: ${payload.date}`,
    `Uhrzeit: ${payload.time}`,
    `Passagiere: ${payload.pax}`,
    `Gepäck: ${payload.luggage || '0'}`,
    `Flugnummer: ${payload.flight || 'Keine'}`,
    `Kindersitz: ${payload.childseat === 'ja' ? 'Ja' : 'Nein'}`,
    '',
    '--- PERSÖNLICHE DATEN ---',
    `Name: ${payload.name}`,
    `Telefon: ${payload.phone}`,
    `E-Mail: ${payload.email}`,
    `Notizen: ${payload.notes || 'Keine'}`,
    '',
    '--- BEZAHLUNG ---',
    `Zahlungsart: ${payload.payment}`,
    `Preis: €${payload.price || '0'}`,
    '',
    '====================================',
    'Ende der Buchung',
    '===================================='
  ];
  return lines.join('\n');
};

export { getEl, getValue, setFieldStatus, showMessage, isValidAustrianPostalCode, generateBookingText };
