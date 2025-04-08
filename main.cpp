#include <iostream>
#include "headers\karczma.h"
#include "headers\browar.h"
#include "headers\edge.h"
#include "headers/field.h"


int main(){

    std::cout<<"Super projekt!"<<std::endl;
    Karczma* k1 = new Karczma({20,20});
    Browar* b1 = new Browar({30,30}, 0.6);
    Edge* e1 = new Edge(20, k1, b1);

    return 0;
}