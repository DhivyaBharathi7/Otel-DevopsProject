// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const health = require('grpc-js-health-check')
const opentelemetry = require('@opentelemetry/api')

const path = require('path')
const charge = require('./charge')
const logger = require('./logger')

async function chargeServiceHandler(call, callback) {
  const span = opentelemetry.trace.getActiveSpan();

  try {
    const amount = call.request.amount
    span?.setAttributes({
      'app.payment.amount': parseFloat(`${amount.units}.${amount.nanos}`).toFixed(2)
    })
    logger.info({ request: call.request }, "Charge request received.")

    const response = await charge.charge(call.request)
    callback(null, response)

  } catch (err) {
    logger.warn({ err })

    span?.recordException(err)
    span?.setStatus({ code: opentelemetry.SpanStatusCode.ERROR })
    callback(err)
  }
}

async function closeGracefully(signal) {
  server.forceShutdown()
process.kill(process.pid, signal)
}


const PROTO_PATH = path.join(__dirname, 'pb', 'demo.proto')

const otelDemoPackage = grpc.loadPackageDefinition(
  protoLoader.loadSync(PROTO_PATH)
)
const server = new grpc.Server()

server.addService(health.service, new health.Implementation({
  '': health.servingStatus.SERVING
}))

server.addService(otelDemoPackage.oteldemo.PaymentService.service, { charge: chargeServiceHandler })

const port = process.env.PAYMENT_PORT || 8085;

server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, boundPort) => {
    if (err) {
      return logger.error({ err });
    }
    logger.info(`payment gRPC server started on port ${boundPort}`);
    server.start();
  }
);

async function closeGracefully(signal) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.forceShutdown();
  process.exit(0);
}

process.once('SIGINT', () => closeGracefully('SIGINT'));
process.once('SIGTERM', () => closeGracefully('SIGTERM'));
