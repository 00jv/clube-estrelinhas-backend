import { Request, Response, NextFunction } from 'express';

export function adminMiddleware(request: Request, response: Response, next: NextFunction) {
  const user = (request as any).user;

  if (!user) {
    return response.status(401).json({ error: 'Não autenticado' });
  }

  if (user.role !== 'ADMIN') {
    return response.status(403).json({ error: 'Acesso negado: Apenas administradores podem acessar esta rota' });
  }

  return next();
}
