cmake_minimum_required(VERSION 3.26)
project(currency)

# ------------------- Packages -------------------
find_package(Protobuf REQUIRED)
find_package(gRPC CONFIG REQUIRED)
find_package(opentelemetry-cpp CONFIG REQUIRED)

# ------------------- Include directories -------------------
include_directories(${Protobuf_INCLUDE_DIRS})
include_directories(${CMAKE_SOURCE_DIR}/src)
include_directories(${CMAKE_BINARY_DIR})  # For generated .pb.h and .grpc.pb.h

# ------------------- Proto files -------------------
set(PROTO_FILES
    ${CMAKE_SOURCE_DIR}/pb/demo.proto
)

# Generate protobuf sources
protobuf_generate_cpp(PROTO_SRCS PROTO_HDRS ${PROTO_FILES})

# Generate gRPC sources
grpc_generate_cpp(GRPC_SRCS GRPC_HDRS ${PROTO_FILES})

# ------------------- Build executable -------------------
add_executable(currency
    src/server.cpp
    ${PROTO_SRCS}
    ${PROTO_HDRS}
    ${GRPC_SRCS}
    ${GRPC_HDRS}
)

# ------------------- Link libraries -------------------
target_link_libraries(currency
    protobuf::libprotobuf
    ${Protobuf_LIBRARIES}
    ${OPENTELEMETRY_CPP_LIBRARIES}
    opentelemetry_trace
    opentelemetry_common
    opentelemetry_exporter_otlp_grpc
    opentelemetry_exporter_otlp_grpc_client
    opentelemetry_proto
    opentelemetry_otlp_recordable
    opentelemetry_resources
    opentelemetry_metrics
    opentelemetry_exporter_otlp_grpc_metrics
    gRPC::grpc++
)

# ------------------- Install -------------------
install(TARGETS currency DESTINATION bin)


