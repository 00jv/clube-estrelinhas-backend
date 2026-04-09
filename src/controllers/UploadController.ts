import { Request, Response } from 'express';

export class UploadController {
  uploadImage(request: Request, response: Response) {
    try {
      if (!request.file) {
        return response.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const imageUrl = (request.file as any).path;

      return response.json({ 
        url: imageUrl, 
        filename: request.file.filename,
        originalName: request.file.originalname 
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
  }
}
