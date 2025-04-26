#pragma once
#include "iostream"
#include <crow.h>
#include "../../includes/crow/middlewares/cors.h"
#include "router.hpp"
#include <memory>
#include "string"

class Router;

class Server {
public:
    crow::App<crow::CORSHandler> app;
    std::unique_ptr<Router> router;

    Server();
    ~Server();

    void init();

    void routerHandler();
};