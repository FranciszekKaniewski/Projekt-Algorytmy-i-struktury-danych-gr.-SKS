#pragma once
#include <cmath>
#include <sstream>
#include <algorithm>
#include "../../src/headers/maxFlowSolver.hpp"
#include "../../src/headers/vertex.hpp"
#include "../../src/headers/Edge.hpp"
#include "./test.hpp"

struct MaxFlowTest_Answer{
    float barleyMaxFlow;
    float beerMaxFlow;
    vector<tuple<int,int,float>> beerPaths;
    vector<tuple<int,int,float>> barleyPaths;
};

#include "./MaxFlowTest.hpp"
#include "./MaxFlowCostsTest.hpp"

class MaxFlowTestGroup : public TestGroup {
public:
    bool costs;
    MaxFlowTestGroup(string name, bool costs=false) : TestGroup(name), costs(costs) {};
    ~MaxFlowTestGroup()  = default;

    void LoadData(string fileName) override;
};