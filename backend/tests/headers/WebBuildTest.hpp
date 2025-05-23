#pragma once
#include "./WebBuildTestsGroup.hpp"

class WebBuildTest : public Test {
public:
    MaxFlowSolver* maxFlowSolver;
    WebBuildTest_Answers answers;

    WebBuildTest(MaxFlowSolver* maxFlowSolver, WebBuildTest_Answers answers, std::string name);
    ~WebBuildTest() {delete maxFlowSolver;};
private:
    void Run() override;

    bool areAlmostEqual(float a, float b, float epsilon);
    float parseValue(const string& token);
    bool CompareArrays(vector<int>& a, vector<int>& b);
};