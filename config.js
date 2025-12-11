// Zentrale Konfiguration für alle Sprachen und Daten

const PRICING_MAP = {
  'flughafen': { limousine: 65, minivan: 85, first: 110 },
  'chauffeur': { limousine: 65, minivan: 85, first: 110 },
  'taxi': { limousine: 65, minivan: 85, first: 110 }
};

const VALIDATION_RULES = {
  rideType: { required: true },
  pickup: { required: true, minLength: 5 },
  pickupZip: { required: true, regex: /^[0-9]{4}$/, msg: 'Postleitzahl muss 4 Ziffern haben.' },
  dropoff: { required: true, minLength: 5 },
  dropoffZip: { required: true, regex: /^[0-9]{4}$/, msg: 'Postleitzahl muss 4 Ziffern haben.' },
  date: { required: true },
  time: { required: true },
  pax: { required: true },
  name: { required: true, minLength: 3 },
  phone: { required: true, regex: /^\+?[0-9\s\-()]{7,}$/, msg: 'Ungültige Telefonnummer.' },
  email: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ungültige E-Mail.' },
  payment: { required: true }
};

const KNOWN_LOCATIONS = {
  'flughafen wien': '1300',
  'flughafen wien-schwechat': '1300',
  'schwechat': '1300',
  'stephansplatz': '1010',
  'schönbrunn': '1130',
  'rathaus wien': '1080'
};

export { PRICING_MAP, VALIDATION_RULES, KNOWN_LOCATIONS };
