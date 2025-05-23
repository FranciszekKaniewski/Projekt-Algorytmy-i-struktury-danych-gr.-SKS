#pragma once
#include "./test.hpp"
#include "../../src/headers/maxFlowSolver.hpp"

struct MaxFlowTest_Answer{
    float barleyMaxFlow;
    float beerMaxFlow;
    vector<tuple<int,int,float>> beerPaths;
    vector<tuple<int,int,float>> barleyPaths;
};

class MaxFlowTest : public Test{
public:
    static int number;
    MaxFlowSolver* maxFlowSolver;
    vector<Vertex*> vertices;

    MaxFlowTest(MaxFlowSolver* maxFlowSolver, MaxFlowTest_Answer answer, string name, vector<Vertex*> vertices);
    ~MaxFlowTest();
    void Run() override;
private:
    MaxFlowTest_Answer answer;
};