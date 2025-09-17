FROM golang:1.24.2-alpine AS builder

WORKDIR /usr/src/app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build
COPY . .
RUN go build -ldflags="-s -w" -o /go/bin/checkout .

# Final runtime image
FROM alpine

WORKDIR /usr/src/app

COPY --from=builder /go/bin/checkout .

EXPOSE 8083
ENTRYPOINT ["./checkout"]
