#include "src/headers/app.hpp"
#include "src/headers/Edge.hpp"

Server *server = nullptr;

int main()
{    
    Field f1(2.2, 1.1, 5.0f);
    Field f2(5.2, 2.8, 2.9);
    Brewery b1(1.2, 2.2);
    Cross c1(4.4, 5.5, 8.0);
    Inn i1(5.0, 4.0);
    
     Edge e1(&f1, &b1);
     Edge e2(&b1, &c1);
     Edge e3(&c1, &i1);
    
    cout << "Brewery 1 id" << b1.id << endl;
    cout << "Cross 1 id" << c1.id << endl;
    cout << "Inn 1 id" << i1.id << endl;
    cout << "Lenght from B1 to C1" << e2.length << endl;

    server = new Server;

    server->app.bindaddr("0.0.0.0").port(3000).run();

    return 0;
}