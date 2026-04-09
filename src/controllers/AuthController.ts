import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthController {
  async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response.status(400).json({ error: 'E-mail e senha são obrigatórios' });
      }

      // Try Admin first
      let account: any = await prisma.admin.findUnique({ where: { email } });
      let role = 'ADMIN';

      // If not admin, try User
      if (!account) {
        account = await (prisma as any).user.findUnique({ where: { email } });
        role = 'USER';
      }

      if (!account) {
        return response.status(401).json({ error: 'Credenciais inválidas' });
      }

      const passwordMatch = await bcrypt.compare(password, account.password);
      if (!passwordMatch) {
        return response.status(401).json({ error: 'Credenciais inválidas' });
      }

      const secret = process.env.JWT_SECRET as string;
      const token = jwt.sign(
        { id: account.id, email: account.email, name: account.name, role },
        secret,
        { expiresIn: '7d' }
      );

      return response.json({
        token,
        user: { id: account.id, name: account.name, email: account.email, role }
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async register(request: Request, response: Response) {
    try {
      const { 
        name, 
        email, 
        password,
        phone,
        zipCode,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        bust,
        waist,
        hips
      } = request.body;

      if (!name || !email || !password) {
        return response.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
      }

      const existingUser = await (prisma as any).user.findUnique({ where: { email } });
      if (existingUser) {
        return response.status(400).json({ error: 'E-mail já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await (prisma.user as any).create({
        data: { 
          name, 
          email, 
          password: hashedPassword,
          phone,
          zipCode,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          bust: bust ? parseFloat(bust) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null
        }
      });

      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'USER'
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async me(request: Request, response: Response) {
    try {
      const user = (request as any).user;
      if (!user) {
        return response.status(401).json({ error: 'Não autenticado' });
      }

      // Fetch full data from DB based on role and ID
      let fullAccount: any;
      console.log(`[DEBUG] Buscando perfil para ID: ${user.id}, Role: ${user.role}`);
      
      if (user.role === 'ADMIN') {
        fullAccount = await prisma.admin.findUnique({ where: { id: user.id } });
      } else {
        fullAccount = await (prisma as any).user.findUnique({ where: { id: user.id } });
      }

      console.log(`[DEBUG] Dados encontrados no banco:`, fullAccount ? 'SIM' : 'NÃO');
      if (fullAccount) {
        console.log(`[DEBUG] Campos detectados:`, Object.keys(fullAccount).join(', '));
      }

      if (!fullAccount) {
        return response.status(404).json({ error: 'Conta não encontrada' });
      }

      // Don't return password
      const { password, ...accountInfo } = fullAccount;

      return response.json({
        ...accountInfo,
        role: user.role
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateProfile(request: Request, response: Response) {
    try {
      const userToken = (request as any).user;
      if (!userToken || userToken.role !== 'USER') {
        return response.status(401).json({ error: 'Apenas clientes podem atualizar perfil por esta rota' });
      }

      const { 
        name, 
        phone, 
        zipCode, 
        street, 
        number, 
        complement, 
        neighborhood, 
        city, 
        state,
        bust,
        waist,
        hips
      } = request.body;

      const updatedUser = await (prisma as any).user.update({
        where: { id: userToken.id },
        data: {
          name,
          phone,
          zipCode,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          bust: bust ? parseFloat(bust) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null
        }
      });

      // Don't return password
      const { password, ...userInfo } = updatedUser;

      return response.json(userInfo);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }
}
