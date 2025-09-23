// utils/grpcClients.ts

declare var process: any;

function getGrpcTarget(envVar: string): string {
  // Runtime environment check
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[envVar];
    if (value && value.trim() !== "") {
      return value;
    }
  }
  
  // Fallback values for each service
  const fallbacks: { [key: string]: string } = {
    'PRODUCT_CATALOG_ADDR': 'product-catalog:8086',
    'CART_SERVICE_ADDR': 'cart:8082',
    'CURRENCY_SERVICE_ADDR': 'currency:8084',
    'RECOMMENDATION_SERVICE_ADDR': 'recommendation:1010',
    'PAYMENT_SERVICE_ADDR': 'payment:8085',
    'SHIPPING_SERVICE_ADDR': 'shipping:8088',
    'AD_SERVICE_ADDR': 'ad:8081',
    'CHECKOUT_SERVICE_ADDR': 'checkout:8083',
  };
  
  return fallbacks[envVar] || 'localhost:8080';
}

export const PRODUCT_CATALOG_TARGET = getGrpcTarget('PRODUCT_CATALOG_ADDR');
export const CART_SERVICE_TARGET = getGrpcTarget('CART_SERVICE_ADDR');
export const CURRENCY_SERVICE_TARGET = getGrpcTarget('CURRENCY_SERVICE_ADDR');
export const RECOMMENDATION_SERVICE_TARGET = getGrpcTarget('RECOMMENDATION_SERVICE_ADDR');
export const PAYMENT_SERVICE_TARGET = getGrpcTarget('PAYMENT_SERVICE_ADDR');
export const SHIPPING_SERVICE_TARGET = getGrpcTarget('SHIPPING_SERVICE_ADDR');
export const AD_SERVICE_TARGET = getGrpcTarget('AD_SERVICE_ADDR');
export const CHECKOUT_SERVICE_TARGET = getGrpcTarget('CHECKOUT_SERVICE_ADDR');

const grpcClients = {
  PRODUCT_CATALOG_TARGET,
  CART_SERVICE_TARGET,
  CURRENCY_SERVICE_TARGET,
  RECOMMENDATION_SERVICE_TARGET,
  PAYMENT_SERVICE_TARGET,
  SHIPPING_SERVICE_TARGET,
  AD_SERVICE_TARGET,
  CHECKOUT_SERVICE_TARGET,
};

export default grpcClients;