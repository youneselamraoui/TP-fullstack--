const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Etudiant = require('../models/Etudiant');
const Admin    = require('../models/Admin');

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const existing = await Etudiant.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email déjà utilisé.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await Etudiant.create({ nom, prenom, email, passwordHash });

    return res.status(201).json({ message: 'Compte créé avec succès.', id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }


    let user = await Admin.findByEmail(email);
    if (!user) {
      user = await Etudiant.findByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id:    user.id,
        nom:   user.nom,
        email: user.email,
        role:  user.role
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};


exports.me = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id);
    } else {
      user = await Etudiant.findById(req.user.id);
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};
