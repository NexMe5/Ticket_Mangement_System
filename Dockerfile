FROM golang:1.24-alpine AS build
WORKDIR /src
COPY backend/go.mod ./
RUN go mod download
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /ticket-system ./cmd/api

FROM alpine:3.21
RUN addgroup -S app && adduser -S -G app app
COPY --from=build /ticket-system /usr/local/bin/ticket-system
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
ENTRYPOINT ["ticket-system"]

