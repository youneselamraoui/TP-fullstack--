import express from "express"
import * as studentControllers from '../controllers/studentControllers.js'

const router = express.Router();

router.get('/student', studentControllers.getStudent);
router.post('/student', studentControllers.createStudent);
router.put('/student/:id', studentControllers.updateStudent);
router.delete('/student/:id', studentControllers.deleteStudent);


export default router;