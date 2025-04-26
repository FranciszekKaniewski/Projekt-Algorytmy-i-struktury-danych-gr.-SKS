#include "headers/app.hpp"

void Server::init() {

    std::cout << "[Leasining...] http://127.0.0.1:3000\n";

    auto& cors = this->app.get_middleware<crow::CORSHandler>();
    cors
            .global()
            .headers("X-Custom-Header", "Upgrade-Insecure-Requests")
            .methods("POST"_method, "GET"_method)
            .prefix("/")
            .origin("http://localhost:5173")
            .allow_credentials();
}

void Server::routerHandler() {

    CROW_ROUTE(this->app, "/")
            ([]() {
                return "Hello world!";
            });

    this->router = std::make_unique<Router>(this->app,this->allVertices,"/api");
}

Server::Server() {
    this->init();
    this->routerHandler();
}
Server::~Server() {}