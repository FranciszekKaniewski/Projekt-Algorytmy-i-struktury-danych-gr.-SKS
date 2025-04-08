#include "vertex.h"

class Field : public Vertex{
public:
    Field(Position pos, float productionPerYear);
    float productionPerYear;
};