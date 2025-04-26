#include "src/headers/app.hpp"
#include "src/headers/Edge.hpp"

Server *server = nullptr;

int main()
{
    Vertex v1(1, 1);
    Vertex v2(2, 2);
    Vertex v3(3, 3);
    
    Edge e1(v1, v2, false);
    Edge e2(v2, v3, true);
    
    cout << "Edge 1 length: " << e1.length << endl;
    cout << "Edge 2 length: " << e2.length << endl;
    
    server = new Server;

    server->app.bindaddr("0.0.0.0").port(3000).run();

    return 0;
}