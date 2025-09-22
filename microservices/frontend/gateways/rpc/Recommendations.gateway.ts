// gateways/rpc/Recommendations.gateway.ts
// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ChannelCredentials } from '@grpc/grpc-js';
import { ListRecommendationsResponse, RecommendationServiceClient } from '../../protos/demo';

const RecommendationsGateway = () => ({
  listRecommendations(userId: string, productIds: string[], target?: string) {
    const addr = target || process.env.RECOMMENDATION_SERVICE_ADDR || 'recommendation:1010';
    const client = new RecommendationServiceClient(addr, ChannelCredentials.createInsecure());

    return new Promise<ListRecommendationsResponse>((resolve, reject) =>
      client.listRecommendations({ userId, productIds }, (error, response) =>
        error ? reject(error) : resolve(response)
      )
    );
  },
});

export default RecommendationsGateway();

