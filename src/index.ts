import express from 'express';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes';
import emailInterestRoute from './routes/emailInterestRoutes';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', emailRoutes);
app.use('/api', emailInterestRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
