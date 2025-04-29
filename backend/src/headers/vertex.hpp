#pragma once
#include <vector>

using namespace std;

struct Location{
    double x;
    double y;
};

class Vertex{
public:
    int id;
    static int counter;
    Vertex() {};
    Vertex(double x, double y);
    virtual ~Vertex() = default;
    Location location;

    void print();
    static Vertex* findOnePtrById(vector<Vertex*>& arr, int id);
};

class Field : public Vertex{
public:
    float production;
    Field(double x, double y, float production);
};

class Brewery : public Vertex{
public:
    static float ratio;
    Brewery(double x, double y);  
};

class Inn : public Vertex {
public:
    Inn(double x, double y);
};

class Cross : public Vertex{
public:
    float limit;
    Cross(double x, double y, float limit);  
};