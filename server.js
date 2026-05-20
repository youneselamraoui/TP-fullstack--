const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes        = require('./routes/authRoutes');
const formationRoutes   = require('./routes/formationRoutes');
const inscriptionRoutes = require('./routes/inscriptionRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//route--
app.use('/api/auth',        authRoutes);
app.use('/api/formations',  formationRoutes);
app.use('/api/inscription', inscriptionRoutes);
app.use('/api',             inscriptionRoutes); // pour /api/mes-formations


app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));


app.use((req, res) => res.status(404).json({ message: 'Route introuvable.' }));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
