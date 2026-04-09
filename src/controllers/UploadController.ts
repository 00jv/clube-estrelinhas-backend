import { Request, Response } from 'express';

export class UploadController {
  uploadImage(request: Request, response: Response) {
    try {
      if (!request.file) {
        return response.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3333}`;
      const imageUrl = `${baseUrl}/uploads/${request.file.filename}`;

      return response.json({ url: imageUrl, filename: request.file.filename });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
  }
}
