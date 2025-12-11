const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes für HTML-Dateien
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'index.html'));
});

// Deutsche Seiten
app.get('/de', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'index.html'));
});

app.get('/de/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'index.html'));
});

app.get('/de/buchung', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'buchung.html'));
});

app.get('/de/buchung.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'buchung.html'));
});

app.get('/de/flughafen', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'flughafen.html'));
});

app.get('/de/chauffeur', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'chauffeur.html'));
});

app.get('/de/taxi', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'taxi.html'));
});

app.get('/de/kontakt', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'kontakt.html'));
});

app.get('/de/impressum', (req, res) => {
  res.sendFile(path.join(__dirname, 'de', 'impressum.html'));
});

app.get('/en/:page', (req, res) => {
  const page = req.params.page || 'index.html';
  res.sendFile(path.join(__dirname, 'en', `${page}.html`));
});

app.get('/ru/:page', (req, res) => {
  const page = req.params.page || 'index.html';
  res.sendFile(path.join(__dirname, 'ru', `${page}.html`));
});

app.get('/ar/:page', (req, res) => {
  const page = req.params.page || 'index.html';
  res.sendFile(path.join(__dirname, 'ar', `${page}.html`));
});

app.get('/he/:page', (req, res) => {
  const page = req.params.page || 'index.html';
  res.sendFile(path.join(__dirname, 'he', `${page}.html`));
});

// 404 Handler
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'de', 'index.html'));
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Send booking endpoint
app.post('/send-booking', async (req, res) => {
  try {
    const { email, name, phone, bookingText, rideType, pickup, dropoff, date, time, price } = req.body;

    // Email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Karakaya - Ihre Buchungsbestätigung',
      html: `
        <h2>Vielen Dank für Ihre Buchung!</h2>
        <p>Liebe/r ${name},</p>
        <p>wir haben Ihre Buchung erhalten. Hier sind Ihre Buchungsdetails:</p>
        <hr>
        <p><strong>Fahrtart:</strong> ${rideType}</p>
        <p><strong>Von:</strong> ${pickup}</p>
        <p><strong>Nach:</strong> ${dropoff}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Uhrzeit:</strong> ${time}</p>
        <p><strong>Preis:</strong> €${price}</p>
        <hr>
        <p>Sie erhalten in Kürze eine Bestätigung von unserem Team.</p>
        <p><strong>Kontaktieren Sie uns:</strong></p>
        <p>Telefon: +43 681 2044 7876<br>
        Email: info@karakayataxi.at</p>
        <p>Mit freundlichen Grüßen,<br>
        Karakaya Private Chauffeur & Taxi</p>
      `,
      attachments: [{
        filename: `booking_${date}_${name.replace(/\s+/g, '_')}.txt`,
        content: bookingText
      }]
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'umut.ilhan81@gmail.com',
      subject: `Neue Buchung: ${rideType} - ${date}`,
      html: `
        <h2>Neue Buchung eingegangen</h2>
        <p><strong>Kunde:</strong> ${name}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Fahrtart:</strong> ${rideType}</p>
        <p><strong>Von:</strong> ${pickup}</p>
        <p><strong>Nach:</strong> ${dropoff}</p>
        <p><strong>Datum:</strong> ${date}</p>
        <p><strong>Uhrzeit:</strong> ${time}</p>
        <p><strong>Preis:</strong> €${price}</p>
      `,
      attachments: [{
        filename: `booking_${date}_${name.replace(/\s+/g, '_')}.txt`,
        content: bookingText
      }]
    });

    res.json({ success: true, message: 'Buchung erfolgreich versendet' });
  } catch (error) {
    console.error('Fehler beim Email-Versand:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
  console.log(`📂 Statische Dateien: ${path.join(__dirname)}`);
});
