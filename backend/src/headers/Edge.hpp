#ifndef ROAD_HPP
#define ROAD_HPP
#include "vertex.hpp"
#include<vector>

using namespace std;

class Edge{
    public:
        Edge(Vertex* start, Vertex* end, double cost = 0);
        Vertex* start;
        Vertex* end;

        static int freeId;
        int id;
        double length;
        double cost;
    };

#endif // ROAD_HPP