#include "headers/Edge.hpp"
#include <cmath>

using namespace std;

Edge::Edge(Vertex* start, Vertex* end, double cost) : start(start), end(end), cost(cost) {
    this->id = freeId;
    freeId ++;
    length = sqrt(pow(end->location.x - start->location.x, 2) + pow(end->location.y - start->location.y, 2));
}

int Edge::freeId = 0;