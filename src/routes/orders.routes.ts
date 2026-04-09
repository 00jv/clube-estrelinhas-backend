import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middlewares/auth';

const ordersRoutes = Router();
const orderController = new OrderController();

ordersRoutes.use(authMiddleware);

ordersRoutes.get('/me', orderController.listMyOrders);
ordersRoutes.get('/', orderController.list);
ordersRoutes.get('/:id', orderController.getById);
ordersRoutes.post('/', orderController.create);
ordersRoutes.put('/:id/status', orderController.updateStatus);

export { ordersRoutes };
