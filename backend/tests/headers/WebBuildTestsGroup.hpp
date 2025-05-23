#pragma once
#include <cmath>
#include <sstream>
#include <algorithm>
#include "../../src/headers/maxFlowSolver.hpp"
#include "../../src/headers/vertex.hpp"
#include "../../src/headers/Edge.hpp"
#include "./test.hpp"
#include "./WebBuildTest.hpp"
#include "./MaxFlowTest.hpp"

class WebBuildTestsGroup : public TestGroup{
public:
    WebBuildTestsGroup(string name) : TestGroup(name) {};
    ~WebBuildTestsGroup()  = default;

    void LoadData(string fileName) override;
};