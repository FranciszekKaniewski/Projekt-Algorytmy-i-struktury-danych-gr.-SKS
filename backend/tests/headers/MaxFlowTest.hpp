#pragma once
#include "./test.hpp"
#include "../../src/headers/maxFlowSolver.hpp"
#include "./MaxFlowTestsGroup.hpp"

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