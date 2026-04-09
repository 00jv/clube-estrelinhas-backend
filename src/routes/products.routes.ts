import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const productsRoutes = Router();
const productController = new ProductController();

productsRoutes.get('/', productController.list);
productsRoutes.get('/slug/:slug', productController.getBySlug);
productsRoutes.get('/id/:id', productController.getById);
productsRoutes.post('/', productController.create);
productsRoutes.put('/:id', productController.update);
productsRoutes.delete('/:id', productController.delete);

export { productsRoutes };
