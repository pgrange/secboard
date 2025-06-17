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


# Install Zaproxy
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/zaproxy/zaproxy/releases/download/v2.16.1/ZAP_2.16.1_Linux.tar.gz | tar xz

# Install nuclei
RUN apt-get update && apt-get install -y \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /tmp/nuclei
RUN curl -L https://github.com/projectdiscovery/nuclei/releases/download/v3.4.5/nuclei_3.4.5_linux_amd64.zip -o /tmp/nuclei/nuclei.zip
RUN unzip /tmp/nuclei/nuclei.zip -d /tmp/nuclei
RUN cp /tmp/nuclei/nuclei /opt/bin/nuclei 
RUN rm -rf /tmp/nuclei
