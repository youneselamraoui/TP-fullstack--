import * as studentServices from "../services/studentServices.js"

export const getStudent = async (req, res) => {
    try {
        const student = await studentServices.getStudent();
        res.status(200).json(student);
    } catch (err) {
        console.error('Error fetching student', err); 
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createStudent = async (req, res) => {
    try {
        const studentData = req.body;
        const newStudent = await studentServices.createStudent(studentData); 
        res.status(200).json(newStudent);
    } catch (err) {
        console.error('Error adding student:', err); 
        res.status(500).json({ message: err.message }); // ← changer ici
    }
};

export const updateStudent = async (req, res) => {
    try {
        const studentId= req.params.id;
        const studentData = req.body;
        const updatedStudent = await studentServices.updateStudent(studentId,studentData);
        if (!updatedStudent){
            return res.status(404).json({message:'student not found'});
        } 
        res.status(200).json(updatedStudent);
    } catch (err) {
        console.error('Error updating student:', err); 
        res.status(500).json({  message: err.message }); 
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const studentId= req.params.id;
        const deleted = await studentServices.deleteStudent(studentId);
        if (!deleted){
            return res.status(404).json({message:'student not found'});
        }
        res.status(200).send();
    } catch (err) {
        console.error('Error deleting student:', err); 
        res.status(500).json({  message: err.message }); 
    }
};

