#include "headers/vertex.h"

int Vertex::id = 0;

Vertex::Vertex(Position pos) {
    this->position = pos;
    Vertex::id ++;
}
