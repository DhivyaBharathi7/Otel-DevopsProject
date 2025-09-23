cmake_minimum_required(VERSION 3.1)
project(currency)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ------------------- Packages -------------------
find_package(Protobuf REQUIRED)
find_package(gRPC CONFIG REQUIRED)
find_package(opentelemetry-cpp CONFIG REQUIRED)

# Add the genproto subdirectory to generate proto files
add_subdirectory(genproto)

# Include paths for generated proto files and OpenTelemetry headers
include_directories("${CMAKE_BINARY_DIR}/generated/proto")

# Copy demo.proto from global pb directory to local proto directory
configure_file("${CMAKE_SOURCE_DIR}/../../pb/pb/demo.proto" "${CMAKE_SOURCE_DIR}/proto/demo.proto" COPYONLY)

# Add the currency executable
add_executable(currency
    src/server.cpp
)

# Link libraries
target_link_libraries(
    currency
    demo-proto
    protobuf::libprotobuf
    gRPC::grpc++
    opentelemetry-cpp::api
    opentelemetry-cpp::sdk
    opentelemetry-cpp::ext
    opentelemetry-cpp::exporters_otlp
)

# Install binary
install(TARGETS currency DESTINATION bin)