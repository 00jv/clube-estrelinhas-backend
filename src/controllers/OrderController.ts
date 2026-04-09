import { prisma } from '../lib/prisma';

export class OrderController {
  async list(request: Request, response: Response) {
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return response.json(orders);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }

  async listMyOrders(request: Request, response: Response) {
    try {
      const user = (request as any).user;
      if (!user) {
        return response.status(401).json({ error: 'Não autenticado' });
      }

      const orders = await prisma.order.findMany({
        where: {
          userId: (request as any).user.id
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return response.json(orders);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar seus pedidos' });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { items } = request.body;
      const userId = (request as any).user.id;

      if (!userId) {
        return response.status(401).json({ error: 'Usuário não autenticado no backend' });
      }

      // Buscar perfil do usuário para capturar dados obrigatórios e snapshots
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Calcular total e preparar itens com dados do banco por segurança
      let totalAmount = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          return response.status(400).json({ error: `Produto ${item.productId} não encontrado` });
        }

        const itemPrice = product.price;
        totalAmount += itemPrice * item.quantity;

        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: itemPrice
        });
      }

      // Snapshot do endereço e medidas
      const deliveryAddress = `${user.street || 'S/R'}, ${user.number || 'S/N'}${user.complement ? ' - ' + user.complement : ''}. ${user.neighborhood || 'S/B'}, ${user.city || 'S/C'} - ${user.state || 'UF'}. CEP: ${user.zipCode || '00000-000'}`;
      const bodyMeasurements = `Busto: ${user.bust || 0}cm, Cintura: ${user.waist || 0}cm, Quadril: ${user.hips || 0}cm`;

      const order = await prisma.order.create({
        data: {
          userId,
          customerName: user.name,
          email: user.email,
          phone: user.phone,
          totalAmount,
          status: 'PAID', // Simulação: sempre pago no sucesso do checkout
          zipCode: user.zipCode,
          street: user.street,
          number: user.number,
          complement: user.complement,
          neighborhood: user.neighborhood,
          city: user.city,
          state: user.state,
          bust: user.bust,
          waist: user.waist,
          hips: user.hips,
          items: {
            create: orderItemsToCreate
          }
        },
        include: {
          items: true
        }
      });

      return response.status(201).json(order);
    } catch (error: any) {
      console.error("ERRO DETALHADO AO CRIAR PEDIDO:", error);
      return response.status(500).json({ 
        error: 'Erro ao criar pedido',
        details: error.message || 'Erro desconhecido'
      });
    }
  }

  async getById(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      if (!order) {
        return response.status(404).json({ error: 'Pedido não encontrado' });
      }

      return response.json(order);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }

  async updateStatus(request: Request, response: Response) {
    try {
      const id = request.params.id as string;
      const { status } = request.body; // Expects one of OrderStatus enum e.g. "PAID", "COMPLETED"

      const order = await prisma.order.update({
        where: { id },
        data: { status }
      });

      return response.json(order);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
  }
}
