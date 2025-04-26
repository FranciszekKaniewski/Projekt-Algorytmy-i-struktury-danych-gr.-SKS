#pragma once
#include "app.hpp"

class Router {
public:
    Router(crow::App<crow::CORSHandler>& app_, std::string path = "");

private:
    void setupRoutes();
    crow::App<crow::CORSHandler>& app_;
    std::string path;
};
