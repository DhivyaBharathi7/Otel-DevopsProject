// gateways/rpc/ProductCatalog.gateway.ts
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import { ListProductsResponse, Product, ProductCatalogServiceClient } from '../../protos/demo';

const ProductCatalogGateway = () => ({
  listProducts(target?: string) {
    const addr = target || process.env.PRODUCT_CATALOG_ADDR || 'product-catalog:8086';
    const client = new ProductCatalogServiceClient(addr, ChannelCredentials.createInsecure());

    return new Promise<ListProductsResponse>((resolve, reject) =>
      client.listProducts({}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },

  getProduct(id: string, target?: string) {
    const addr = target || process.env.PRODUCT_CATALOG_ADDR || 'product-catalog:8086';
    const client = new ProductCatalogServiceClient(addr, ChannelCredentials.createInsecure());

    return new Promise<Product>((resolve, reject) =>
      client.getProduct({ id }, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default ProductCatalogGateway();

