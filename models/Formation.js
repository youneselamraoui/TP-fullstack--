const db = require('../config/db');

class Formation {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM formations ORDER BY id DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM formations WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create({ titre, duree }) {
    const [result] = await db.execute(
      'INSERT INTO formations (titre, duree) VALUES (?, ?)',
      [titre, duree]
    );
    return result.insertId;
  }

  static async update(id, { titre, duree }) {
    const [result] = await db.execute(
      'UPDATE formations SET titre = ?, duree = ? WHERE id = ?',
      [titre, duree, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM formations WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async getInscrits(formationId) {
    const [rows] = await db.execute(
      `SELECT e.id, e.nom, e.prenom, e.email, i.id AS inscription_id
       FROM inscriptions i
       JOIN etudiants e ON i.etudiant_id = e.id
       WHERE i.formation_id = ?`,
      [formationId]
    );
    return rows;
  }
}

module.exports = Formation;
