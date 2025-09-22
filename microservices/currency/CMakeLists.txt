cmake_minimum_required(VERSION 3.26)
project(currency)

find_package(Protobuf REQUIRED)
find_package(gRPC CONFIG REQUIRED)
find_package(opentelemetry-cpp CONFIG REQUIRED)

# Include paths for proto files and OpenTelemetry headers
include_directories("${CMAKE_SOURCE_DIR}/pb" "${OPENTELEMETRY_CPP_INCLUDE_DIRS}")
include_directories("${CMAKE_SOURCE_DIR}/pb")
# Add the currency executable
add_executable(currency
    src/server.cpp
    demo.pb.cc
    demo.grpc.pb.cc
)

# Link libraries
target_link_libraries(
    currency
    protobuf::libprotobuf
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

# Install binary
install(TARGETS currency DESTINATION bin)