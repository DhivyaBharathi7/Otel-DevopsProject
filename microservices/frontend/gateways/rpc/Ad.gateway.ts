// gateways/rpc/Ad.gateway.ts
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import { AdResponse, AdServiceClient } from '../../protos/demo';

const AdGateway = () => ({
  listAds(contextKeys: string[], target?: string) {
    const addr = target || process.env.AD_SERVICE_ADDR || 'ad:8081';
    const client = new AdServiceClient(addr, ChannelCredentials.createInsecure());

    return new Promise<AdResponse>((resolve, reject) =>
      client.getAds({ contextKeys }, (error, response) => (error ? reject(error) : resolve(response)))
    );
  },
});

export default AdGateway();

