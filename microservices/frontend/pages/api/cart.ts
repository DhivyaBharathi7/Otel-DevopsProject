import type { NextApiHandler } from 'next';
import CartGateway from '../../gateways/rpc/Cart.gateway';
import { AddItemRequest, Empty } from '../../protos/demo';
import ProductCatalogService from '../../services/ProductCatalog.service';
import { IProductCart, IProductCartItem } from '../../types/Cart';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import grpcClients from '../../utils/grpcClients';

type TResponse = IProductCart | Empty;

const handler: NextApiHandler<TResponse> = async ({ method, body, query }, res) => {
  try {
    switch (method) {
      case 'GET': {
        const { sessionId = '', currencyCode = '' } = query;

        const { userId, items } = await CartGateway.getCart(
          sessionId as string,
          grpcClients.CART_SERVICE_TARGET
        );

        const productList: IProductCartItem[] = await Promise.all(
          items.map(async ({ productId, quantity }) => {
            const product = await ProductCatalogService.getProduct(
              productId,
              currencyCode as string
            );
            return { productId, quantity, product };
          })
        );

        return res.status(200).json({ userId, items: productList });
      }

      case 'POST': {
        const { userId, item } = body as AddItemRequest;
        await CartGateway.addItem(userId, item!, grpcClients.CART_SERVICE_TARGET);
        const cart = await CartGateway.getCart(userId, grpcClients.CART_SERVICE_TARGET);
        return res.status(200).json(cart);
      }

      case 'DELETE': {
        const { userId } = body as AddItemRequest;
        await CartGateway.emptyCart(userId, grpcClients.CART_SERVICE_TARGET);
        return res.status(204).send('');
      }

      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default InstrumentationMiddleware(handler);

