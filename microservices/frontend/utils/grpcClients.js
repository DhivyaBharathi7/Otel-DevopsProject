// utils/grpcClients.js

function getGrpcTarget(envVar) {
  const value = process.env[envVar];
  if (!value || value.trim() === "") {
    throw new Error(`${envVar} environment variable is missing or empty`);
  }
  return value; // Return plain hostname:port for internal Docker network
}

const PRODUCT_CATALOG_TARGET = getGrpcTarget('PRODUCT_CATALOG_ADDR');
const CART_SERVICE_TARGET = getGrpcTarget('CART_SERVICE_ADDR');
const RECOMMENDATION_SERVICE_TARGET = getGrpcTarget('RECOMMENDATION_SERVICE_ADDR');
const PAYMENT_SERVICE_TARGET = getGrpcTarget('PAYMENT_SERVICE_ADDR');
const SHIPPING_SERVICE_TARGET = getGrpcTarget('SHIPPING_SERVICE_ADDR');
const AD_SERVICE_TARGET = getGrpcTarget('AD_SERVICE_ADDR');
const CHECKOUT_SERVICE_TARGET = getGrpcTarget('CHECKOUT_SERVICE_ADDR');

module.exports = {
  PRODUCT_CATALOG_TARGET,
  CART_SERVICE_TARGET,
  RECOMMENDATION_SERVICE_TARGET,
  PAYMENT_SERVICE_TARGET,
  SHIPPING_SERVICE_TARGET,
  AD_SERVICE_TARGET,
  CHECKOUT_SERVICE_TARGET,
};

