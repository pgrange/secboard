FROM debian:latest

# Install testssl

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

# Install nmap
RUN apt-get update && apt-get install -y \
    nmap \
    && rm -rf /var/lib/apt/lists/*

# Install application
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
  && apt-get update \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /srv/secboard
RUN mkdir /srv/secboard/public

COPY package.json /srv/secboard/
COPY public/ /srv/secboard/public/
COPY src/ /srv/secboard/src/

WORKDIR /srv/secboard
RUN npm install

CMD ["npm", "start"]
