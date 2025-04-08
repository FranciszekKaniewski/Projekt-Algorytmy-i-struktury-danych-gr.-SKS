#include "headers/edge.h"
#include "vertex.h"

int Counter = 0;

Edge::Edge(int val, Vertex v1, Vertex v2){
    id = Counter;
    Counter++;
    maxValue = val;
    currentValue = val;
    this->v1=v1;
    this->v2=v2;
};

void Edge::Add_Edge(int val){
};

