#ifndef ROAD_HPP
#define ROAD_HPP
#include "vertex.hpp"
#include<vector>

using namespace std;

class Edge{
    public:
        Edge(Vertex* start, Vertex* end, bool isBroken = false);
        Vertex* start;
        Vertex* end;

        static int freeId;
        int id;
        bool isBroken;
        double length;
        double cost;
    };

#endif // ROAD_HPP