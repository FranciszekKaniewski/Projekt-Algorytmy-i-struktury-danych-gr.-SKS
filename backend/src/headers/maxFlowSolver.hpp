#pragma once
#include "vector"
#include "./vertex.hpp"
#include "Edge.hpp"

class MaxFlowSolver {
private:
    bool bfs(std::vector<float>& parent);

public:
    bool isBeerCreated;
    std::vector<vector<float>> capacity, flowPassed;
    std::vector<vector<int>> adj;
    int source, barleySink, sink;

    MaxFlowSolver() {};
    MaxFlowSolver(std::vector<Vertex*>& vertices, std::vector<Edge*>& edges);
    float maxFlow(std::vector<tuple<int,int,float>>& used_edges);
};