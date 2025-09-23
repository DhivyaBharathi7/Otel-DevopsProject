// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { resourceFromAttributes, detectResources } from '@opentelemetry/resources';
import { browserDetector } from '@opentelemetry/opentelemetry-browser-detector';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SessionIdProcessor } from './SessionIdProcessor';

const {
  NEXT_PUBLIC_OTEL_SERVICE_NAME = '',
  NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = '',
  IS_SYNTHETIC_REQUEST = '',
} = typeof window !== 'undefined' ? window.ENV : {};

const FrontendTracer = async () => {
  try {
    const { ZoneContextManager } = await import('@opentelemetry/context-zone');

    let resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: NEXT_PUBLIC_OTEL_SERVICE_NAME,
    });
    
    try {
      const detectedResources = detectResources({detectors: [browserDetector]});
      resource = resource.merge(detectedResources);
    } catch (error) {
      console.warn('Failed to detect browser resources:', error);
    }

    const provider = new WebTracerProvider({
      resource,
      spanProcessors: [
        new SessionIdProcessor(),
        new BatchSpanProcessor(
            new OTLPTraceExporter({
              url: NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
            }),
            {
              scheduledDelayMillis: 500,
            }
        ),
      ],
    });

    const contextManager = new ZoneContextManager();

    provider.register({
      contextManager,
      propagator: new CompositePropagator({
        propagators: [
          new W3CBaggagePropagator(),
          new W3CTraceContextPropagator()],
      }),
    });

    registerInstrumentations({
      tracerProvider: provider,
      instrumentations: [
        getWebAutoInstrumentations({
          '@opentelemetry/instrumentation-fetch': {
            propagateTraceHeaderCorsUrls: /.*/,
            clearTimingResources: true,
            applyCustomAttributesOnSpan(span) {
              try {
                if (span && typeof span.setAttribute === 'function') {
                  span.setAttribute('app.synthetic_request', IS_SYNTHETIC_REQUEST);
                }
              } catch (error) {
                console.warn('Failed to set synthetic_request attribute:', error);
              }
            },
          },
        }),
      ],
    });
  } catch (error) {
    console.error('Failed to initialize OpenTelemetry frontend tracer:', error);
  }
};

export default FrontendTracer;
