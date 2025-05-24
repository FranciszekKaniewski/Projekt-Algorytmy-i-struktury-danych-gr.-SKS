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
    float assignedProduction = -1;
    Quadrant(const vector<Point>& numbers, float production);

    bool isInside(Field* f);
};

class MapQuadrants{
public:
    MapQuadrants(){};
    MapQuadrants(vector<Vertex*> allVertices, vector<pair<vector<Point>, float>> points);

    int getQuadrantOfField(Field* f);

    vector<Quadrant*> quadrants;
};