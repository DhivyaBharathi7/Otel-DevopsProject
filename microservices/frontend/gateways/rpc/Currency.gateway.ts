// gateways/rpc/Currency.gateway.ts
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import { GetSupportedCurrenciesResponse, CurrencyServiceClient, Money } from '../../protos/demo';

const currencyTarget = process.env.CURRENCY_SERVICE_ADDR || 'currency:8084';
const client = new CurrencyServiceClient(currencyTarget, ChannelCredentials.createInsecure());

const CurrencyGateway = () => ({
  convert(from: Money, toCode: string) {
    return new Promise<Money>((resolve, reject) =>
      client.convert({ from, toCode }, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
  getSupportedCurrencies() {
    return new Promise<GetSupportedCurrenciesResponse>((resolve, reject) =>
      client.getSupportedCurrencies({}, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default CurrencyGateway();

