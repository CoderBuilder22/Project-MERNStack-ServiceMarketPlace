import express from 'express';
import connectDB from './config/db.js';
import AuthRouter from './routes/AuthRoutes.js';
import AdminRouter from './routes/AdminRoutes.js';
import ProviderRouter from './routes/ProviderRoutes.js';
import CustomerRouter from './routes/CustomerRoutes.js';
import cors from "cors";

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use('/api/auth', AuthRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/provider', ProviderRouter);
app.use('/api/customer', CustomerRouter);
app.use('/images', express.static('public/images'));

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  connectDB();
});
   