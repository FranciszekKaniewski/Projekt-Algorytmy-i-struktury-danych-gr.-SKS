#pragma once
#include "iostream"
#include <crow.h>
#include "../../includes/crow/middlewares/cors.h"
#include "router.hpp"
#include <memory>
#include "string"
#include "vertex.hpp"
#include "Edge.hpp"

class Router;

class Server {
public:
    crow::App<crow::CORSHandler> app;
    std::unique_ptr<Router> router;
    std::vector<Vertex*> allVertices;
    std::vector<Edge*> allEdges;

    Server();
    ~Server();

    void init();

    void routerHandler();
};