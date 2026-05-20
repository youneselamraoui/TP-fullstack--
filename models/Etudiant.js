const db = require('../config/db');

class Etudiant {
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM etudiants WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async create({ nom, prenom, email, passwordHash }) {
    const [result] = await db.execute(
      'INSERT INTO etudiants (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, "etudiant")',
      [nom, prenom, email, passwordHash]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, nom, prenom, email, role FROM etudiants WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT id, nom, prenom, email FROM etudiants'
    );
    return rows;
  }
}

module.exports = Etudiant;
