import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { UploadController } from '../controllers/UploadController';

const uploadRoutes = Router();
const uploadController = new UploadController();

// POST /api/upload  → multipart/form-data com campo "image"
uploadRoutes.post('/', upload.single('image'), uploadController.uploadImage);

export { uploadRoutes };
