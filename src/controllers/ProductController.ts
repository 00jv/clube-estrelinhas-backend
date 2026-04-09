import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
  async list(request: Request, response: Response) {
    try {
      const { category, tag, search } = request.query;

      const products = await prisma.product.findMany({
        where: {
          ...(category && { category: String(category) }),
          ...(tag && { tag: String(tag) }),
          ...(search && {
            name: {
              contains: String(search),
              mode: 'insensitive' // Requires Prisma schema generator with previewFeatures = ["fullTextSearch"] or just default postgres insensitive
            }
          })
        }
      });
      return response.json(products);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  async getBySlug(request: Request, response: Response) {
    try {
      const slug = request.params.slug as string;
      const product = await prisma.product.findUnique({
        where: { slug }
      });

      if (!product) {
        return response.status(404).json({ error: 'Produto não encontrado' });
      }

      return response.json(product);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  async getById(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const product = await prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        return response.status(404).json({ error: 'Produto não encontrado' });
      }

      return response.json(product);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { name, slug, price, image, tag, category, description } = request.body;
      
      const productExists = await prisma.product.findUnique({
        where: { slug }
      });
      
      if (productExists) {
         return response.status(400).json({ error: 'Slug já existe' });
      }

      const product = await prisma.product.create({
        data: {
          name, slug, price, image, tag, category, description
        }
      });

      return response.status(201).json(product);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const { name, slug, price, image, tag, category, description } = request.body;

      const product = await prisma.product.update({
        where: { id },
        data: { name, slug, price, image, tag, category, description }
      });

      return response.json(product);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      
      await prisma.product.delete({
        where: { id }
      });

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }
}
