#include "./headers/vertex.hpp"
#include <iostream>

int Vertex::counter = 0;

Vertex::Vertex(double x, double y){
    this->id = counter;
    counter++;
    location.x = x;
    location.y = y;
}

void Vertex::print(){
    cout << location.x << " " << location.y << " " << this->id <<  endl;
}

