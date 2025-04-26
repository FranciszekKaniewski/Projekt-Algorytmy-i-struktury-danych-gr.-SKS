#pragma once
#include <vector>

using namespace std;

struct Location{
    double x;
    double y;
};

class Vertex{
private:
    static int counter;
    
public:
    int id;
    Vertex(double x, double y);
    Location location;

    void print();
};