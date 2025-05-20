#pragma once
#include <vector>
#include <initializer_list>
#include "vertex.hpp"

using namespace std;

struct Point{
    float x;
    float y;
};

class Quadrant{
public:
    vector<Point> points;
    float assignedProduction;
    Quadrant(initializer_list<Point> numbers, float production);

    bool isInside(Field* f);

};

class MapQuadrants{
public:
    MapQuadrants(){};
    MapQuadrants(vector<Vertex*> allVertices, vector<pair<initializer_list<Point>, float>> points);

    vector<Quadrant*> quadrants;


};