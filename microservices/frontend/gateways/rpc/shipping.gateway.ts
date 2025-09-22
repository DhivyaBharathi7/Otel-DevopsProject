// gateways/rpc/Shipping.gateway.ts
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import {
  ShippingServiceClient,
  ShipOrderRequest,
  ShipOrderResponse,
  GetQuoteRequest,
  GetQuoteResponse,
} from '../../protos/demo';

const ShippingGateway = () => ({
  getQuote(address: any, items: any[], target?: string) {
    const addr = target || process.env.SHIPPING_SERVICE_ADDR || 'shipping:8088';
    const client = new ShippingServiceClient(addr, ChannelCredentials.createInsecure());
    const req: GetQuoteRequest = { address, items };

    return new Promise<GetQuoteResponse>((resolve, reject) =>
      client.getQuote(req, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },

  shipOrder(address: any, items: any[], target?: string) {
    const addr = target || process.env.SHIPPING_SERVICE_ADDR || 'shipping:8088';
    const client = new ShippingServiceClient(addr, ChannelCredentials.createInsecure());
    const req: ShipOrderRequest = { address, items };

    return new Promise<ShipOrderResponse>((resolve, reject) =>
      client.shipOrder(req, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default ShippingGateway();

