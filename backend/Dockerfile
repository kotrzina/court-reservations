FROM golang:1.18 AS builder
ENV CGO_ENABLED 0
ADD . /app
WORKDIR /app
RUN go build -ldflags "-s -w" -v -o court-reservations .

FROM alpine:3
RUN apk update && \
    apk add openssl tzdata && \
    rm -rf /var/cache/apk/* \
    && mkdir /app

WORKDIR /app

ADD Dockerfile /Dockerfile

COPY --from=builder /app/court-reservations /app/court-reservations

RUN chown nobody /app/court-reservations \
    && chmod 500 /app/court-reservations

USER nobody

ENTRYPOINT ["/app/court-reservations"]
