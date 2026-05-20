import { query } from "../db.js"


export const getStudent = async () => {
    const { rows } = await query('SELECT * FROM student');
    return rows;
};

export const createStudent = async (studentData) => { 
    const { nom , prenom, telephone, email } = studentData; 
    const { rows } = await query(
        `INSERT INTO student (nom, prenom, telephone, email)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nom, prenom, telephone, email]
    );
    return rows[0];
};

export const updateStudent = async (studentId, studentData) => { 
    const { nom , prenom, telephone, email } = studentData; 
    const { rows } = await query(
        `UPDATE student SET nom = $1, prenom = $2, telephone = $3, email =$4
         WHERE id = $5 RETURNING *`,
        [nom, prenom, telephone, email, studentId]
    );
    return rows[0];
};

export const deleteStudent = async (studentId) => { 
    const { rowCount } = await query(
        `DELETE FROM student WHERE id = $1`,
        [studentId]  
    );
    return rowCount > 0;  
};

