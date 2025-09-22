# ------------------------------------------------------
# Dockerfile for Currency Service (OpenTelemetry + C++)
# ------------------------------------------------------

FROM alpine:3.21 AS base

# Install runtime dependencies
RUN apk update && \
    apk add --no-cache grpc-dev protobuf-dev

# ------------------- Build Stage -------------------
FROM base AS builder

# Install build tools
RUN apk add --no-cache git cmake make g++ linux-headers

# Set OpenTelemetry version (pass via build arg)
ARG OPENTELEMETRY_CPP_VERSION=1.22.0

# Clone and build OpenTelemetry C++ SDK
RUN git clone --depth 1 --branch v${OPENTELEMETRY_CPP_VERSION} https://github.com/open-telemetry/opentelemetry-cpp \
    && cd opentelemetry-cpp \
    && mkdir build \
    && cd build \
    && cmake .. -DCMAKE_CXX_STANDARD=17 -DCMAKE_POSITION_INDEPENDENT_CODE=ON \
          -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF \
          -DWITH_EXAMPLES=OFF -DWITH_OTLP_GRPC=ON -DWITH_ABSEIL=ON \
    && make -j$(nproc || sysctl -n hw.ncpu || echo 1) install \
    && cd ../..

# Set working directory for currency service
WORKDIR /currency

# Copy your project files
COPY ./src/currency/build/ build/
COPY ./src/currency/proto/ proto/
COPY ./src/currency/src/ src/
COPY ./src/currency/genproto/CMakeLists.txt genproto/CMakeLists.txt
COPY ./src/currency/CMakeLists.txt CMakeLists.txt
COPY ./pb/demo.proto proto/demo.proto

# Build the currency service
RUN mkdir -p build && cd build \
    && cmake .. \
    && make -j$(nproc || sysctl -n hw.ncpu || echo 1) install

# ------------------- Release Stage -------------------
FROM base AS release

# Copy built OpenTelemetry + currency binaries
COPY --from=builder /usr/local /usr/local

WORKDIR /currency

# Expose the service port
EXPOSE 8084

# Run currency service on port 8084
ENTRYPOINT ["sh", "-c", "/usr/local/bin/currency 8084"]
