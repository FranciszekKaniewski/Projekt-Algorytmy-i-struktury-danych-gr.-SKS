#pragma once
#include "vector"
#include "./vertex.hpp"
#include "Edge.hpp"

class MaxFlowSolver {
private:
    bool bfs(std::vector<float>& parent);
    bool spfa(int s, int t, std::vector<int>& parent, std::vector<float>& min_cost_path);

public:
    bool isBeerCreated;
    std::vector<vector<float>> capacity, flowPassed;
    std::vector<vector<int>> adj;
    std::vector<std::vector<float>> cost;
    std::vector<std::vector<bool>> edgeUsedForCost;
    int source, barleySink, sink;

    MaxFlowSolver() {};
    MaxFlowSolver(std::vector<Vertex*>& vertices, std::vector<Edge*>& edges);
    float maxFlow(std::vector<tuple<int,int,float>>& used_edges, std::vector<Vertex*> vertices);
    float minCostMaxFlow(std::vector<std::tuple<int,int,float>>& used_edges, std::vector<Vertex*> vertices, float& totalFlow);
};