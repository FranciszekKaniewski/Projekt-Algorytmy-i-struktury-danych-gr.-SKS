#pragma once
#include "app.hpp"
#include "vertex.hpp"

class Router {
public:
    Router(crow::App<crow::CORSHandler>& app_,std::vector<Vertex*> allVertices, std::string path = "");

private:
    void setupRoutes();
    std::vector<Vertex*> allVertices;
    crow::App<crow::CORSHandler>& app_;
    std::string path;
};
