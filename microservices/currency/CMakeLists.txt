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

# Try various OpenTelemetry library combinations
set(OTEL_LIBS_TO_TRY
    opentelemetry-cpp::trace
    opentelemetry-cpp::metrics
    opentelemetry-cpp::logs
    opentelemetry-cpp::otlp_grpc_exporter
    opentelemetry-cpp::otlp_grpc_log_record_exporter
    opentelemetry-cpp::otlp_grpc_metric_exporter
    opentelemetry-cpp::exporters_otlp_grpc
    opentelemetry-cpp::exporters_otlp_grpc_client
    opentelemetry-cpp::exporters_otlp_grpc_metrics
    opentelemetry-cpp::exporters_otlp_grpc_logs
    opentelemetry-cpp::ext
    opentelemetry-cpp::common
    opentelemetry-cpp::resource
    opentelemetry-cpp::otel_exporter_otlp_grpc
    opentelemetry-cpp::otel_exporter_otlp_grpc_metrics
    opentelemetry-cpp::otel_exporter_otlp_grpc_logs
)

foreach(lib ${OTEL_LIBS_TO_TRY})
    if(TARGET ${lib})
        target_link_libraries(currency ${lib})
        message(STATUS "Linking OpenTelemetry library: ${lib}")
    endif()
endforeach()

# Fallback: link all available OpenTelemetry libraries
if(opentelemetry-cpp_FOUND AND opentelemetry-cpp_LIBRARIES)
    target_link_libraries(currency ${opentelemetry-cpp_LIBRARIES})
    message(STATUS "Linking OpenTelemetry libraries: ${opentelemetry-cpp_LIBRARIES}")
endif()

# Install binary
install(TARGETS currency DESTINATION bin)