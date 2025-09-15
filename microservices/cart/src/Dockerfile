FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder
WORKDIR /usr/src/app/

COPY . ./
COPY ./pb/ ./pb/

RUN dotnet restore ./src/cart.csproj -r linux-musl-x64

RUN dotnet publish ./src/cart.csproj -r linux-musl-x64 --no-restore -o /cart

# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/runtime-deps:8.0-alpine3.20

WORKDIR /usr/src/app/
COPY --from=builder /cart/ ./


ENV DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false

EXPOSE 9055
ENTRYPOINT [ "./cart" ]
