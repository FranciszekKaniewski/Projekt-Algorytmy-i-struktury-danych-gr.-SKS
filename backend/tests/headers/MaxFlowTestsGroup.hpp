#pragma once
#include <cmath>
#include <sstream>
#include <algorithm>
#include "../../src/headers/maxFlowSolver.hpp"
#include "../../src/headers/vertex.hpp"
#include "../../src/headers/Edge.hpp"
#include "./test.hpp"
#include "./MaxFlowTest.hpp"

class MaxFlowTestGroup : public TestGroup {
public:
    MaxFlowTestGroup(string name) : TestGroup(name) {};
    ~MaxFlowTestGroup()  = default;

    void LoadData(string fileName) override;
};