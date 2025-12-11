import { PRICING_MAP, VALIDATION_RULES, KNOWN_LOCATIONS } from './config.js';
import { getEl, getValue, setFieldStatus, showMessage, isValidAustrianPostalCode, generateBookingText } from './utils.js';

function validateForm() {
  let isValid = true;
  
  for (const [fieldId, rules] of Object.entries(VALIDATION_RULES)) {
    const val = getValue(fieldId);
    let fieldValid = true;

    if (rules.required && !val) fieldValid = false;
    if (rules.minLength && val && val.length < rules.minLength) fieldValid = false;
    if (rules.regex && val && !rules.regex.test(val)) fieldValid = false;

    setFieldStatus(fieldId, fieldValid);
    if (!fieldValid) isValid = false;
  }

  return isValid;
}

function validateDateTime() {
  const date = getValue('date');
  const time = getValue('time');
  if (!date || !time) return false;
  
  const bookingTime = new Date(`${date}T${time}`);
  const now = new Date();
  now.setMinutes(now.getMinutes() - 5);
  
  if (bookingTime <= now) {
    setFieldStatus('date', false);
    setFieldStatus('time', false);
    showMessage('Zeitpunkt muss mindestens 30 Minuten in der Zukunft liegen.');
    return false;
  }
  setFieldStatus('date', true);
  setFieldStatus('time', true);
  return true;
}

function validateAddressField(streetId, zipId) {
  const street = getValue(streetId);
  const zip = getValue(zipId);
  
  if (!street || !zip) return true;
  
  const lowerStreet = street.toLowerCase().trim();
  for (const location in KNOWN_LOCATIONS) {
    if (lowerStreet.includes(location)) {
      getEl(zipId).value = KNOWN_LOCATIONS[location];
      break;
    }
  }
  
  const isValid = isValidAustrianPostalCode(getValue(zipId)) && street.length >= 3;
  setFieldStatus(streetId, isValid);
  setFieldStatus(zipId, isValid);
  
  if (!isValid) showMessage('Bitte überprüfen Sie Adresse und Postleitzahl.');
  return isValid;
}

function calcPrice() {
  const type = getValue('rideType');
  const pax = parseInt(getValue('pax')) || 1;
  const vehicle = pax > 3 ? 'minivan' : 'limousine';
  const price = PRICING_MAP[type]?.[vehicle] || 0;
  getEl('priceBox').textContent = `Preis: €${price}`;
  return price;
}

function downloadBookingTxt(bookingText, name) {
  try {
    const blob = new Blob([bookingText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    const safeName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '').substring(0, 30);
    
    link.href = url;
    link.download = `booking_${safeName}_${timestamp}.txt`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Download Fehler:', error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Real-time validation
  ['pickup', 'pickupZip', 'dropoff', 'dropoffZip'].forEach(id => {
    getEl(id)?.addEventListener('blur', () => {
      const isPickup = id.includes('pickup');
      validateAddressField(isPickup ? 'pickup' : 'dropoff', isPickup ? 'pickupZip' : 'dropoffZip');
    });
  });

  getEl('calculateBtn')?.addEventListener('click', () => {
    if (validateForm() && validateDateTime()) {
      calcPrice();
      showMessage('Preis berechnet!', 'success');
    }
  });

  getEl('bookingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm() || !validateDateTime()) return;
    
    const price = calcPrice();
    const payload = {
      name: getValue('name'),
      email: getValue('email'),
      phone: getValue('phone'),
      rideType: getValue('rideType'),
      pickup: getValue('pickup'),
      pickupZip: getValue('pickupZip'),
      dropoff: getValue('dropoff'),
      dropoffZip: getValue('dropoffZip'),
      date: getValue('date'),
      time: getValue('time'),
      pax: getValue('pax'),
      payment: getValue('payment'),
      luggage: getValue('luggage'),
      flight: getValue('flight'),
      childseat: getValue('childseat'),
      notes: getValue('notes'),
      price
    };

    if (!payload.name || !payload.email || !payload.phone) {
      showMessage('Fehler: Erforderliche Daten fehlen.');
      return;
    }

    const bookingText = generateBookingText(payload);
    
    if (!downloadBookingTxt(bookingText, payload.name)) {
      showMessage('Fehler: Download konnte nicht durchgeführt werden.');
      return;
    }

    const subject = `Karakaya Buchung - ${payload.name}`;
    const body = encodeURIComponent(`Neue Buchung von ${payload.name}\n\nEmail: ${payload.email}\n\n${bookingText}`);
    window.location.href = `mailto:umut.ilhan81@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    showMessage('✅ Datei wird heruntergeladen und Email versendet...', 'success');
    
    setTimeout(() => {
      e.target.reset();
      getEl('priceBox').textContent = '';
      document.querySelectorAll('.success, .error').forEach(el => el.classList.remove('success', 'error'));
      showMessage('');
    }, 2000);
  });
});
