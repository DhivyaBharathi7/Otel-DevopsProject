// gateways/rpc/Checkout.gateway.ts
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import { CheckoutServiceClient, PlaceOrderRequest, PlaceOrderResponse } from '../../protos/demo';

const checkoutTarget = process.env.CHECKOUT_SERVICE_ADDR || 'checkout:8083';
const client = new CheckoutServiceClient(checkoutTarget, ChannelCredentials.createInsecure());

const CheckoutGateway = () => ({
  placeOrder(order: PlaceOrderRequest, target?: string) {
  const addr = target || process.env.CHECKOUT_SERVICE_ADDR || '';
  const client = new CheckoutServiceClient(addr, ChannelCredentials.createInsecure());
  return new Promise<PlaceOrderResponse>((resolve, reject) =>
    client.placeOrder(order, (error, response) => (error ? reject(error) : resolve(response)))
  );
}

});

export default CheckoutGateway();

