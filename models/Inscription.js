const db = require('../config/db');

class Inscription {
  static async findByEtudiant(etudiantId) {
    const [rows] = await db.execute(
      `SELECT i.id, f.titre, f.duree, i.formation_id
       FROM inscriptions i
       JOIN formations f ON i.formation_id = f.id
       WHERE i.etudiant_id = ?`,
      [etudiantId]
    );
    return rows;
  }

  static async findOne(etudiantId, formationId) {
    const [rows] = await db.execute(
      'SELECT * FROM inscriptions WHERE etudiant_id = ? AND formation_id = ?',
      [etudiantId, formationId]
    );
    return rows[0];
  }

  static async hasInscription(etudiantId) {
    const [rows] = await db.execute(
      'SELECT * FROM inscriptions WHERE etudiant_id = ?',
      [etudiantId]
    );
    return rows.length > 0;
  }

  static async create(etudiantId, formationId) {
    const [result] = await db.execute(
      'INSERT INTO inscriptions (etudiant_id, formation_id) VALUES (?, ?)',
      [etudiantId, formationId]
    );
    return result.insertId;
  }

  static async delete(etudiantId, formationId) {
    const [result] = await db.execute(
      'DELETE FROM inscriptions WHERE etudiant_id = ? AND formation_id = ?',
      [etudiantId, formationId]
    );
    return result.affectedRows;
  }
}

module.exports = Inscription;
