import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

import { productsRoutes } from './routes/products.routes';
import { ordersRoutes } from './routes/orders.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { authRoutes } from './routes/auth.routes';
import { uploadRoutes } from './routes/upload.routes';
import { authMiddleware } from './middlewares/auth';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

// Protected routes (require JWT)
app.use('/api/orders', ordersRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);

// Generic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3333;

// Only start the listener if not running in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
}

export default app;
