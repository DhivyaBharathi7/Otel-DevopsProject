// gateways/rpc/Cart.gateway.ts
import { ChannelCredentials } from '@grpc/grpc-js';
import { Cart, CartItem, CartServiceClient, Empty } from '../../protos/demo';

const CartGateway = () => ({
  getCart(userId: string, target?: string) {
    const addr = target || process.env.CART_SERVICE_ADDR || '';
    const client = new CartServiceClient(addr, ChannelCredentials.createInsecure());
    return new Promise<Cart>((resolve, reject) =>
      client.getCart({ userId }, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },

  addItem(userId: string, item: CartItem, target?: string) {
    const addr = target || process.env.CART_SERVICE_ADDR || '';
    const client = new CartServiceClient(addr, ChannelCredentials.createInsecure());
    return new Promise<Empty>((resolve, reject) =>
      client.addItem({ userId, item }, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },

  emptyCart(userId: string, target?: string) {
    const addr = target || process.env.CART_SERVICE_ADDR || '';
    const client = new CartServiceClient(addr, ChannelCredentials.createInsecure());
    return new Promise<Empty>((resolve, reject) =>
      client.emptyCart({ userId }, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default CartGateway();

