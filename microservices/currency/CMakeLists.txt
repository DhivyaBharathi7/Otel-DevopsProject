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

# Find OpenTelemetry with specific components
find_package(opentelemetry-cpp QUIET COMPONENTS api sdk ext exporters_otlp)

# If OpenTelemetry is not found with components, try without components
if(NOT opentelemetry-cpp_FOUND)
    find_package(opentelemetry-cpp REQUIRED)
endif()

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

# Link OpenTelemetry libraries if found
if(TARGET opentelemetry-cpp::api)
    target_link_libraries(currency opentelemetry-cpp::api)
endif()
if(TARGET opentelemetry-cpp::sdk) 
    target_link_libraries(currency opentelemetry-cpp::sdk)
endif()
if(TARGET opentelemetry-cpp::ext)
    target_link_libraries(currency opentelemetry-cpp::ext)
endif()
if(TARGET opentelemetry-cpp::exporters_otlp)
    target_link_libraries(currency opentelemetry-cpp::exporters_otlp)
endif()

# Install binary
install(TARGETS currency DESTINATION bin)