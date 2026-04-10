import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middlewares/auth';

const ordersRoutes = Router();
const orderController = new OrderController();

ordersRoutes.use(authMiddleware);

/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: Listar meus pedidos (Cliente)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Order' }
 */
ordersRoutes.get('/me', orderController.listMyOrders);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar todos os pedidos (Admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos
 */
ordersRoutes.get('/', orderController.list);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obter detalhes de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 */
ordersRoutes.get('/:id', orderController.getById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar um novo pedido (Checkout)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, total, paymentMethod]
 *             properties:
 *               items: { type: array, items: { type: object } }
 *               total: { type: number }
 *               paymentMethod: { type: string }
 *     responses:
 *       201:
 *         description: Pedido criado
 */
ordersRoutes.post('/', orderController.create);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Atualizar status de um pedido (Admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: ['PENDENTE', 'PAGO', 'CANCELADO', 'ENVIADO', 'ENTREGUE'] }
 *     responses:
 *       200:
 *         description: Status atualizado
 */
ordersRoutes.put('/:id/status', orderController.updateStatus);

export { ordersRoutes };
