#include "headers/Edge.hpp"
#include <cmath>

using namespace std;

Edge::Edge(Vertex start, Vertex end, bool isBroken) : start(start), end(end), isBroken(isBroken) {
    length = sqrt(pow(end.location.x - start.location.x, 2) + pow(end.location.y - start.location.y, 2));
}