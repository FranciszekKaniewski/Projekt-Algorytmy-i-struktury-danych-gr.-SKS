#ifndef ROAD_HPP
#define ROAD_HPP
#include "vertex.hpp"
#include<vector>

using namespace std;


class Edge{
    public:
        Edge(Vertex start, Vertex end, bool isBroken);    
        Vertex start;
        Vertex end;
        
        bool isBroken;
        double length;
    };

#endif // ROAD_HPP