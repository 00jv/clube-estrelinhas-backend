import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import { productsRoutes } from './routes/products.routes';
import { ordersRoutes } from './routes/orders.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { authRoutes } from './routes/auth.routes';
import { uploadRoutes } from './routes/upload.routes';
import { authMiddleware } from './middlewares/auth';

const app = express();

// 1. CORS Configuration (MUST BE FIRST)
const corsOptions = {
  origin: [
    'https://clube-estrelinhas-frontend.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// 2. Body Parser
app.use(express.json());

// 3. Static Files
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);

// 5. Health Check (for testing)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 6. Generic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ 
    error: 'Erro interno no servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 3333;

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
}

export default app;
