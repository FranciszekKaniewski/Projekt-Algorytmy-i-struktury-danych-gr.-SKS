FROM gcc:13


RUN apt-get update && apt-get install -y make curl


WORKDIR /tmp
RUN curl -L -o asio.zip https://github.com/chriskohlhoff/asio/archive/refs/tags/asio-1-28-0.zip \
    && apt-get install -y unzip \
    && unzip asio.zip \
    && mkdir -p /usr/local/include/asio \
    && cp -r asio-asio-1-28-0/asio/include/* /usr/local/include/asio


WORKDIR /app
COPY . .


ENV CPLUS_INCLUDE_PATH=/usr/local/include/asio
