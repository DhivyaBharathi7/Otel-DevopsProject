// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Context } from "@opentelemetry/api";
import { ReadableSpan, Span, SpanProcessor } from "@opentelemetry/sdk-trace-web";
import SessionGateway from "../../gateways/Session.gateway";
import { AttributeNames } from "../enums/AttributeNames";

// Safe session retrieval with error handling
let userId: string = '';
try {
    const session = SessionGateway.getSession();
    userId = session?.userId || '';
} catch (error) {
    console.warn('Failed to get session for telemetry:', error);
    userId = '';
}

export class SessionIdProcessor implements SpanProcessor {
    forceFlush(): Promise<void> {
        return Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onStart(span: Span, parentContext: Context): void {
        // Add null check to prevent setAttribute errors
        if (span && typeof span.setAttribute === 'function' && userId) {
            try {
                span.setAttribute(AttributeNames.SESSION_ID, userId);
            } catch (error) {
                console.warn('Failed to set session ID attribute on span:', error);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    onEnd(span: ReadableSpan): void {}

    shutdown(): Promise<void> {
        return Promise.resolve();
    }
}
