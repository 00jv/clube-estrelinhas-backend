import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const productsRoutes = Router();
const productController = new ProductController();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtrar por categoria
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *         description: Filtrar por tag
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por nome
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Product' }
 */
productsRoutes.get('/', productController.list);

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Buscar produto por slug
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 */
productsRoutes.get('/slug/:slug', productController.getBySlug);

/**
 * @swagger
 * /api/products/id/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Produto encontrado
 */
productsRoutes.get('/id/:id', productController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar um novo produto (Admin)
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       201:
 *         description: Produto criado
 */
productsRoutes.post('/', productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar um produto (Admin)
 *     tags: [Produtos]
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
 *           schema: { $ref: '#/components/schemas/Product' }
 *     responses:
 *       200:
 *         description: Produto atualizado
 */
productsRoutes.put('/:id', productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Excluir um produto (Admin)
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Produto excluído
 */
productsRoutes.delete('/:id', productController.delete);

export { productsRoutes };
