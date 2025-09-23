FROM alpine:3.21 AS base

# Install runtime dependencies
RUN apk update && \
    apk add --no-cache grpc-dev protobuf-dev

# ------------------- Build Stage -------------------
FROM base AS builder

# Install build tools
RUN apk add --no-cache git cmake make g++ linux-headers

# Set OpenTelemetry version (pass via build arg)
ARG OPENTELEMETRY_CPP_VERSION=1.16.1

# Clone and build OpenTelemetry C++ SDK
RUN git clone --depth 1 --branch v${OPENTELEMETRY_CPP_VERSION} https://github.com/open-telemetry/opentelemetry-cpp \
    && cd opentelemetry-cpp \
    && mkdir build \
    && cd build \
    && cmake .. -DCMAKE_CXX_STANDARD=17 -DCMAKE_POSITION_INDEPENDENT_CODE=ON \
          -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF \
          -DWITH_EXAMPLES=OFF -DWITH_OTLP_GRPC=ON -DWITH_ABSEIL=ON \
          -DWITH_API=ON -DWITH_SDK=ON -DWITH_EXT=ON \
          -DCMAKE_POLICY_DEFAULT_CMP0057=NEW \
    && make -j$(nproc || sysctl -n hw.ncpu || echo 1) install \
    && cd ../..

# Set working directory for currency service
WORKDIR /currency

# Copy your project files
COPY ./proto/ proto/
COPY ./src/ src/
COPY ./genproto/ genproto/
COPY ./CMakeLists.txt CMakeLists.txt
COPY ./data/ data/

# Copy the demo.proto file from the project root to the proto directory
COPY  ./pb/demo.proto proto/demo.proto

# Build the currency service
RUN mkdir -p build && cd build \
    && cmake .. -DCMAKE_POLICY_DEFAULT_CMP0057=NEW \
    && make -j$(nproc || sysctl -n hw.ncpu || echo 1) install

# ------------------- Release Stage -------------------
FROM alpine:3.21 AS release

# Install ALL runtime dependencies for the currency service
RUN apk update && \
    apk add --no-cache \
        grpc-dev \
        protobuf-dev \
        libstdc++ \
        libgcc \
        ca-certificates \
        openssl \
        c-ares \
        re2 \
        zlib

# Copy built OpenTelemetry libraries and currency binary
COPY --from=builder /usr/local /usr/local

# Copy currency data files if needed
COPY --from=builder /currency/data/ /currency/data/

WORKDIR /currency

# Expose the service port
EXPOSE 8084

# Run currency service on port 8084
ENTRYPOINT ["sh", "-c", "/usr/local/bin/currency 8084"]
