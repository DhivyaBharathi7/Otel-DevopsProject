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

# Find OpenTelemetry - try with and without components
find_package(opentelemetry-cpp REQUIRED)

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
)

# Link OpenTelemetry libraries conditionally based on availability
if(TARGET opentelemetry-cpp::api)
    target_link_libraries(currency opentelemetry-cpp::api)
endif()

if(TARGET opentelemetry-cpp::sdk) 
    target_link_libraries(currency opentelemetry-cpp::sdk)
endif()

if(TARGET opentelemetry-cpp::trace)
    target_link_libraries(currency opentelemetry-cpp::trace)
endif()

if(TARGET opentelemetry-cpp::metrics)
    target_link_libraries(currency opentelemetry-cpp::metrics)
endif()

if(TARGET opentelemetry-cpp::logs)
    target_link_libraries(currency opentelemetry-cpp::logs)
endif()

if(TARGET opentelemetry-cpp::otlp_grpc_exporter)
    target_link_libraries(currency opentelemetry-cpp::otlp_grpc_exporter)
endif()

if(TARGET opentelemetry-cpp::otlp_grpc_log_record_exporter)
    target_link_libraries(currency opentelemetry-cpp::otlp_grpc_log_record_exporter)
endif()

if(TARGET opentelemetry-cpp::otlp_grpc_metric_exporter)
    target_link_libraries(currency opentelemetry-cpp::otlp_grpc_metric_exporter)
endif()

# Fallback: link all available OpenTelemetry libraries
if(opentelemetry-cpp_FOUND AND opentelemetry-cpp_LIBRARIES)
    target_link_libraries(currency ${opentelemetry-cpp_LIBRARIES})
endif()

# Install binary
install(TARGETS currency DESTINATION bin)