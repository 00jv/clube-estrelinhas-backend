import { prisma } from '../lib/prisma';

export class DashboardController {
  async getStats(request: Request, response: Response) {
    try {
      const orders = await prisma.order.findMany();
      const totalProducts = await prisma.product.count();

      const totalOrders = orders.length;
      
      // Calculate revenue from PAID and COMPLETED orders
      const totalRevenue = orders
        .filter(order => order.status === 'PAID' || order.status === 'COMPLETED')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      // Recent orders (last 5)
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      return response.json({
        totalOrders,
        totalProducts,
        totalRevenue,
        recentOrders
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
  }
}
