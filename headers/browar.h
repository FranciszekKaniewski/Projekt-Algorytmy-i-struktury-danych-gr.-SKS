#include "vertex.h"

class Browar : public Vertex{
public:
    Browar(Position pos, float ratio);
    float tonConversionRatio;
    int currentBarley;

    float countBeerAmount();
};