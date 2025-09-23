// gateways/rpc/Currency.gateway.ts
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import { GetSupportedCurrenciesResponse, CurrencyServiceClient, Money } from '../../protos/demo';

const CurrencyGateway = () => ({
  convert(from: Money, toCode: string, target?: string) {
    const addr = target || 'currency:8084';
    const client = new CurrencyServiceClient(addr, ChannelCredentials.createInsecure());
    return new Promise<Money>((resolve, reject) =>
      client.convert({ from, toCode }, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  getSupportedCurrencies(target?: string) {
    const addr = target || 'currency:8084';
    const client = new CurrencyServiceClient(addr, ChannelCredentials.createInsecure());
    return new Promise<GetSupportedCurrenciesResponse>((resolve, reject) =>
      client.getSupportedCurrencies({}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default CurrencyGateway();

