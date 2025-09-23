cmake_minimum_required(VERSION 3.15)
project(currency)

# Set CMake policies for compatibility
cmake_policy(SET CMP0057 NEW)  # Support for IN_LIST operator

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Additional CMake settings for compatibility
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
set(CMAKE_BUILD_TYPE Release)

# ------------------- Packages -------------------
find_package(Protobuf REQUIRED)
find_package(gRPC CONFIG REQUIRED)

# Find OpenTelemetry with all required components
find_package(opentelemetry-cpp REQUIRED COMPONENTS 
    api 
    sdk 
    ext_common 
    exporters_otlp_common 
    exporters_otlp_grpc_client
    exporters_otlp_grpc_metrics
    exporters_otlp_grpc_logs
)

# Add the genproto subdirectory to generate proto files
add_subdirectory(genproto)

# Include paths for generated proto files and OpenTelemetry headers
include_directories("${CMAKE_BINARY_DIR}/generated/proto")

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
    opentelemetry-cpp::ext_common
    opentelemetry-cpp::exporters_otlp_common
    opentelemetry-cpp::exporters_otlp_grpc_client
    opentelemetry-cpp::exporters_otlp_grpc_metrics
    opentelemetry-cpp::exporters_otlp_grpc_logs
)

# Install binary
install(TARGETS currency DESTINATION bin)