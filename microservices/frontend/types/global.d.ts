/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      FRONTEND_PORT?: string;
      FRONTEND_ADDR?: string;
      AD_SERVICE_ADDR?: string;
      CART_SERVICE_ADDR?: string;
      CHECKOUT_SERVICE_ADDR?: string;
      CURRENCY_SERVICE_ADDR?: string;
      PAYMENT_SERVICE_ADDR?: string;
      PRODUCT_CATALOG_ADDR?: string;
      RECOMMENDATION_SERVICE_ADDR?: string;
      SHIPPING_SERVICE_ADDR?: string;
      FLAGD_HOST?: string;
      FLAGD_PORT?: string;
      OTEL_SERVICE_NAME?: string;
      OTEL_EXPORTER_OTLP_ENDPOINT?: string;
      OTEL_EXPORTER_OTLP_INSECURE?: string;
      NEXT_PUBLIC_OTEL_SERVICE_NAME?: string;
      NEXT_PUBLIC_PLATFORM_URL?: string;
      WEB_OTEL_SERVICE_NAME?: string;
      PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
    }
  }

  interface Window {
    localStorage: Storage;
    sessionStorage: Storage;
  }
}

export {};