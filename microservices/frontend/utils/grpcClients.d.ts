declare module './grpcClients' {
  interface GrpcClients {
    PRODUCT_CATALOG_TARGET: string;
    CART_SERVICE_TARGET: string;
    CURRENCY_SERVICE_TARGET: string;
    RECOMMENDATION_SERVICE_TARGET: string;
    PAYMENT_SERVICE_TARGET: string;
    SHIPPING_SERVICE_TARGET: string;
    AD_SERVICE_TARGET: string;
    CHECKOUT_SERVICE_TARGET: string;
  }

  const grpcClients: GrpcClients;
  export default grpcClients;
}