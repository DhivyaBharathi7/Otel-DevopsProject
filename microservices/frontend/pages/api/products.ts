// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, url, headers } = req;
  const { currencyCode } = req.query;
  
  try {
    const backendUrl = process.env.PRODUCT_CATALOG_ADDR || 'product-catalog:8086';
    const apiUrl = `http://${backendUrl}`;
    
    let targetUrl = `${apiUrl}/products`;
    if (req.query.productId) {
      targetUrl = `${apiUrl}/products/${req.query.productId}`;
    }
    
    if (currencyCode) {
      targetUrl += `?currencyCode=${currencyCode}`;
    }

    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.body && { 'Content-Length': JSON.stringify(req.body).length.toString() }),
      },
      ...(req.body && { body: JSON.stringify(req.body) }),
    });

    const data = await response.text();
    res.status(response.status);
    
    if (data) {
      res.json(JSON.parse(data));
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Product API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;