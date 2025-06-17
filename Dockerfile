FROM debian:latest

RUN apt-get update && apt-get install -y \
    curl \
    tar \
    openssl \
    net-tools \
    iputils-ping \
    procps \
    git \
    bash \
    bsdmainutils \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt
RUN curl -L https://github.com/testssl/testssl.sh/archive/refs/tags/v3.2.1.tar.gz | tar xz
RUN mkdir /opt/bin
RUN ln -s /opt/testssl.sh-*/testssl.sh bin/testssl.sh

