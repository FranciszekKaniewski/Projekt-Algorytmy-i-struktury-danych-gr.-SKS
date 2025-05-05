#include "./headers/maxFlowSolver.hpp"
#include <bits/stdc++.h>
#include <tuple>

using namespace std;
MaxFlowSolver::MaxFlowSolver(std::vector<Vertex*>& vertices, std::vector<Edge*>& edges){
    int n = vertices.size();
    source = n;
    barleySink = n + 1;
    sink = n + 2;

    capacity.assign(n + 3, vector<float>(n + 3, 0));
    flowPassed.assign(n + 3, vector<float>(n + 3, 0));
    adj.resize(n + 3);

    for (auto& edge : edges) {
        int u = edge->start->id;
        int v = edge->end->id;
        adj[u].push_back(v);
        adj[v].push_back(u);

        capacity[u][v] = 1410065408;
        capacity[v][u] = 1410065408;
    }

    for (auto v : vertices) {
        if (auto f = dynamic_cast<Field*>(v)) {
            adj[source].push_back(v->id);
            adj[v->id].push_back(source);
            capacity[source][v->id] = f->production;
        }
        if (auto c = dynamic_cast<Cross*>(v)) {
            for (int next : adj[v->id]) {
                capacity[v->id][next] = min((float)capacity[v->id][next], (float)c->limit);
                capacity[next][v->id] = min((float)capacity[next][v->id], (float)c->limit);
            }
        }
        if (auto b = dynamic_cast<Brewery*>(v)) {
            adj[barleySink].push_back(v->id);
            adj[v->id].push_back(barleySink);

            capacity[v->id][barleySink] = 1410065408;
            capacity[barleySink][v->id] = 1410065408;
        }
        if (auto i = dynamic_cast<Inn*>(v)) {
            adj[v->id].push_back(sink);
            adj[sink].push_back(v->id);
            capacity[v->id][sink] = 1410065408;
        }
    }
}

bool MaxFlowSolver::bfs(std::vector<float>& parent){
    int s = isBeerCreated ? barleySink : source;
    int t = isBeerCreated ? sink : barleySink;

    fill(parent.begin(), parent.end(), -1);
    queue<int> q;
    q.push(s);
    parent[s] = -2;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();

        for (int next : adj[cur]) {
            if (parent[next] == -1 && capacity[cur][next] - flowPassed[cur][next] > 0) {
                parent[next] = cur;
                if (next == t)
                    return true;
                q.push(next);
            }
        }
    }
    return false;
}

float MaxFlowSolver::maxFlow(std::vector<tuple<int,int,float>>& used_edges) {

    for (auto& row : flowPassed)
        std::fill(row.begin(), row.end(), 0);

    float flow = 0;
    int t = isBeerCreated ? sink : barleySink;
    int s = isBeerCreated ? barleySink : source;
    vector<float> parent(capacity.size());

    const float EPSILON = 1e-6f;

    while (bfs(parent)) {
        float path_flow = 1410065408;
        float cur = t;
        while (cur != s) {
            float prev = parent[cur];
            path_flow = min((float)path_flow, capacity[prev][cur] - (float)flowPassed[prev][cur]);
            cur = prev;
        }

        if (path_flow < EPSILON)
            break;

        cur = t;
        while (cur != s) {
            float prev = parent[cur];
            flowPassed[prev][cur] += path_flow;
            flowPassed[cur][prev] -= path_flow;
            cur = prev;
        }

        flow += path_flow;
    }

    for (int u = 0; u < flowPassed.size(); ++u) {
        for (int v : adj[u]) {
            if (flowPassed[u][v] > 0 && u != s && v != t) {
                used_edges.emplace_back(u, v, flowPassed[u][v]);
            }
        }
    }

    return flow;
}