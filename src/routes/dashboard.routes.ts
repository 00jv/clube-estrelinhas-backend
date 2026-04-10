import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obter estatísticas do dashboard (Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas gerais do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders: { type: number }
 *                 totalProducts: { type: number }
 *                 totalCustomers: { type: number }
 *                 totalRevenue: { type: number }
 */
dashboardRoutes.get('/stats', authMiddleware, adminMiddleware, dashboardController.getStats);

export { dashboardRoutes };
