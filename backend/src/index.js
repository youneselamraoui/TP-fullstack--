import express from 'express'
import cors from 'cors'
import studentRoutes from "./routes/studentRoutes.js"

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 
app.use('/api', studentRoutes);

app.listen(port, () => {
    console.log("listening on port 3000")
});