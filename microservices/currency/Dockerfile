FROM alpine:3.18 AS builder

RUN apk update && apk add git cmake make g++ grpc-dev protobuf-dev linux-headers

RUN git clone --depth 1 --branch v1.22.0 https://github.com/open-telemetry/opentelemetry-cpp \
    && cd opentelemetry-cpp/ \
    && mkdir build \
    && cd build \
    && cmake .. -DCMAKE_CXX_STANDARD=17 -DCMAKE_POSITION_INDEPENDENT_CODE=ON \
          -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF \
          -DWITH_EXAMPLES=OFF -DWITH_OTLP_GRPC=ON -DWITH_ABSEIL=ON \
    && make -j$(nproc || sysctl -n hw.ncpu || echo 1) install && cd ../..
COPY ./src /currency/src
COPY ./pb /currency/pb
COPY ./CMakeLists.txt /currency/
RUN cd /currency \
    && mkdir -p build && cd build \
    && cmake .. \
    && make -j$(nproc || sysctl -n hw.ncpu || echo 1) install
FROM alpine:3.18 AS release

RUN apk update && apk add grpc-dev protobuf-dev
COPY --from=builder /usr/local /usr/local

EXPOSE 8084
ENTRYPOINT ["sh", "-c", "./usr/local/bin/currency }"]
