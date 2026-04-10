import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { UploadController } from '../controllers/UploadController';

const uploadRoutes = Router();
const uploadController = new UploadController();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload de imagem para o Cloudinary (Admin)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url: { type: string }
 *                 public_id: { type: string }
 */
uploadRoutes.post('/', upload.single('image'), uploadController.uploadImage);

export { uploadRoutes };
