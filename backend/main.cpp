#include "src/headers/app.hpp"
#include "./src/headers/vertex.hpp"

Server *server = nullptr;

int main()
{
    Vertex v1(12.7, 124.4);
    Vertex v2(1214.7, 125124.4);
    Vertex v3(125.7, 111224.4);
    v1.print();
    v2.print();
    v3.print();
    server = new Server;

    server->app.bindaddr("0.0.0.0").port(3000).run();
    

    return 0;
}