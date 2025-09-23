cmake_minimum_required(VERSION 3.15)
project(currency)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set CMake policies
cmake_policy(SET CMP0057 NEW)

# ------------------- Packages -------------------
find_package(Protobuf REQUIRED)
find_package(gRPC CONFIG REQUIRED)
find_package(opentelemetry-cpp CONFIG REQUIRED)

# Include generated proto directory
add_subdirectory(genproto)

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

# Link OpenTelemetry if available
if(TARGET opentelemetry-cpp::api)
    target_link_libraries(currency 
        opentelemetry-cpp::api
        opentelemetry-cpp::sdk
        opentelemetry-cpp::ext
        opentelemetry-cpp::exporters_otlp_grpc
    )
endif()

# Install binary
install(TARGETS currency DESTINATION bin)