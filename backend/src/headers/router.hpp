#pragma once
#include "app.hpp"
#include "vertex.hpp"
#include "Edge.hpp"

class Router {
public:
    Router(crow::App<crow::CORSHandler>& app_,std::vector<Vertex*> allVertices, std::vector<Edge*> allEdges, std::string path = "");

private:
    void setupRoutes();
    std::vector<Vertex*> allVertices;
    std::vector<Edge*> allEdges;
    crow::App<crow::CORSHandler>& app_;
    std::string path;
};
