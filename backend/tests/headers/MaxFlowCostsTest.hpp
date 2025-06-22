#pragma once
#include "./test.hpp"
#include "../../src/headers/maxFlowSolver.hpp"
#include "MaxFlowTestsGroup.hpp"

class MaxFlowCostsTest : public Test{
public:
    static int number;
    MaxFlowSolver* maxFlowSolver;
    vector<Vertex*> vertices;

    MaxFlowCostsTest(MaxFlowSolver* maxFlowSolver, MaxFlowTest_Answer answer, string name, vector<Vertex*> vertices);
    ~MaxFlowCostsTest();
    void Run() override;
private:
    MaxFlowTest_Answer answer;
};