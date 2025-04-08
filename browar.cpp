#include "headers/browar.h"

Browar::Browar(Position pos,float ratio): Vertex(pos){
    tonConversionRatio = ratio;
}

float Browar::countBeerAmount(){
    return tonConversionRatio * currentBarley;
};
