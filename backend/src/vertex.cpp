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

Field::Field(double x, double y, float production) : Vertex(x,y), production(production) {};

Brewery::Brewery(double x, double y) : Vertex(x,y) {};

float Brewery::ratio = 2.5; 

Inn::Inn(double x, double y) : Vertex(x,y) {};

Cross::Cross(double x, double y, float limit) : Vertex(x,y), limit(limit) {};
