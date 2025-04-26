#include "src/headers/app.hpp"

Server *server = nullptr;

int main()
{
    server = new Server;

    server->app.bindaddr("0.0.0.0").port(3000).run();

    return 0;
}