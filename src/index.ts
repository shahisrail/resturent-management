import dotenv from 'dotenv';
import { connectDB } from './config/db';
import app from './app';

dotenv.config();
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
