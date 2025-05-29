#include "./headers/maxFlowSolver.hpp"
#include <bits/stdc++.h>
#include <tuple>

using namespace std;
MaxFlowSolver::MaxFlowSolver(std::vector<Vertex*>& vertices, std::vector<Edge*>& edges){
    int n = vertices.size();
    source = n;
    barleySink = n + 1;
    sink = n + 2;

    isBeerCreated = false;

    capacity.assign(n + 3, vector<float>(n + 3, 0));
    flowPassed.assign(n + 3, vector<float>(n + 3, 0));
    cost.assign(n + 3, vector<float>(n + 3, 0));
    edgeUsedForCost.assign(n + 3, vector<bool>(n + 3, false));
    adj.resize(n + 3);

    for (auto& edge : edges) {
        int u = edge->start->id;
        int v = edge->end->id;
        adj[u].push_back(v);
        adj[v].push_back(u);

        capacity[u][v] = 1410065408;
        capacity[v][u] = 1410065408;

        cost[u][v] = edge->cost;
        cost[v][u] = edge->cost;
    }

    for (auto v : vertices) {
        if (auto f = dynamic_cast<Field*>(v)) {
            adj[source].push_back(v->id);
            adj[v->id].push_back(source);
            capacity[source][v->id] = f->production;
            cost[source][v->id] = 0;
        }
        if (auto c = dynamic_cast<Cross*>(v)) {
            for (int next : adj[v->id]) {
                capacity[v->id][next] = min((float)capacity[v->id][next], (float)c->limit);
                capacity[next][v->id] = min((float)capacity[next][v->id], (float)c->limit);

                cost[v->id][next] = max(cost[v->id][next], 0.0f);
                cost[next][v->id] = max(cost[next][v->id], 0.0f);
            }
        }
        if (auto b = dynamic_cast<Brewery*>(v)) {
            adj[barleySink].push_back(v->id);
            adj[v->id].push_back(barleySink);

            capacity[v->id][barleySink] = 1410065408;
            capacity[barleySink][v->id] = 1410065408;

            cost[v->id][barleySink] = 0;
            cost[barleySink][v->id] = 0;
        }
        if (auto i = dynamic_cast<Inn*>(v)) {
            adj[v->id].push_back(sink);
            adj[sink].push_back(v->id);
            capacity[v->id][sink] = 1410065408;
            cost[v->id][sink] = 0;
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

float MaxFlowSolver::maxFlow(std::vector<tuple<int,int,float>>& used_edges, std::vector<Vertex*> vertices) {

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

                if (!isBeerCreated) {
                    if(auto* b = dynamic_cast<Brewery*>(vertices[v])) {
                        b->storage += flowPassed[u][v] * Brewery::ratio;
                        this->capacity[b->id][this->barleySink] = b->storage;
                        this->capacity[this->barleySink][b->id] = b->storage;
                    }
                }else if(isBeerCreated){
                    if(auto* b = dynamic_cast<Brewery*>(vertices[u])) {
                        b->storage = 0;
                        cout<<b->storage<<endl;
                        this->capacity[b->id][this->barleySink] = b->storage;
                        this->capacity[this->barleySink][b->id] = b->storage;
                    }
                }
            }
        }
    }

    return flow;
}

bool MaxFlowSolver::spfa(int s, int t, std::vector<int>& parent, std::vector<float>& min_cost_path){
    fill(min_cost_path.begin(), min_cost_path.end(), numeric_limits<float>::max());
    fill(parent.begin(), parent.end(), -1);
    std::vector<bool> inQueue(capacity.size(), false);
    queue<int> q;

    min_cost_path[s] = 0;
    q.push(s);
    inQueue[s] = true;

    while(!q.empty()){
        int u = q.front();
        q.pop();
        inQueue[u] = false;

        for(int v : adj[u]){
            if(capacity[u][v] - flowPassed[u][v] > 0 && min_cost_path[v] > min_cost_path[u] + cost[u][v]){
                min_cost_path[v] = min_cost_path[u] + cost[u][v];
                parent[v] = u;
                if(!inQueue[v]){
                    q.push(v);
                    inQueue[v] = true;
                }
            }

            if(flowPassed[v][u] > 0 && min_cost_path[v] > min_cost_path[u] - cost[v][u]){
                min_cost_path[v] = min_cost_path[u] - cost[v][u];
                parent[v] = u;
                if(!inQueue[v]){
                    q.push(v);
                    inQueue[v] = true;
                }
            }
        }
    }

    return min_cost_path[t] != numeric_limits<float>::max();
}


float MaxFlowSolver::minCostMaxFlow(std::vector<std::tuple<int,int,float>>& used_edges, std::vector<Vertex*> vertices, float& totalFlow){
    for(auto& row : flowPassed){
        std::fill(row.begin(), row.end(), 0);
    }

    float totalCalculatedCost = 0;
    totalFlow = 0;
    int s = isBeerCreated ? barleySink : source;
    int t = isBeerCreated ? sink : barleySink;

    std::vector<int> parent(capacity.size());
    std::vector<float> min_cost_path(capacity.size());

    const float EPSILON = 1e-6f;

    while(spfa(s, t, parent, min_cost_path)){
        float path_flow = numeric_limits<float>::max();
        int cur = t;
        while(cur != s){
            int prev = parent[cur];
            if(capacity[prev][cur] - flowPassed[prev][cur] > EPSILON){
                path_flow = min(path_flow, capacity[prev][cur] - flowPassed[prev][cur]);
            }
            else if(flowPassed[cur][prev] > EPSILON){
                path_flow = min(path_flow, flowPassed[cur][prev]);
            }
            cur = prev;
        }

        if(path_flow < EPSILON){
            break;
        }

        cur = t;
        while(cur != s){
            int prev = parent[cur];
            if(capacity[prev][cur] - flowPassed[prev][cur] > EPSILON){
                if(!edgeUsedForCost[prev][cur]){
                    totalCalculatedCost += cost[prev][cur];
                    edgeUsedForCost[prev][cur] = true;
                }
                if(!edgeUsedForCost[cur][prev]){
                    edgeUsedForCost[cur][prev] = true;
                }
            }
            flowPassed[prev][cur] += path_flow;
            flowPassed[cur][prev] -= path_flow;
            cur = prev;
        }
        totalFlow += path_flow;
    }

    for(int u = 0; u < flowPassed.size(); ++u){
        for(int v : adj[u]){
            if(flowPassed[u][v] > EPSILON && u != s && v != t){
                used_edges.emplace_back(u, v, flowPassed[u][v]);

                if(!isBeerCreated){
                    if(auto* b = dynamic_cast<Brewery*>(vertices[v])){
                        b->storage += flowPassed[u][v] * Brewery::ratio;
                        this->capacity[b->id][this->barleySink] = b->storage;
                        this->capacity[this->barleySink][b->id] = b->storage;
                    }
                }else{
                    if(auto* b = dynamic_cast<Brewery*>(vertices[u])){
                        b->storage -= flowPassed[u][v];
                        if(b->storage < EPSILON) b->storage = 0;
                        this->capacity[b->id][this->barleySink] = b->storage;
                        this->capacity[this->barleySink][b->id] = b->storage;
                    }
                }
            }
        }
    }
    return totalCalculatedCost;
}
