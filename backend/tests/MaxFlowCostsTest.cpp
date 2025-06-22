#include "./headers/MaxFlowCostsTest.hpp"

MaxFlowCostsTest::MaxFlowCostsTest(MaxFlowSolver* maxFlowSolver, MaxFlowTest_Answer answer, string name, vector<Vertex*> vertices) : maxFlowSolver(maxFlowSolver), answer(answer), vertices(vertices), Test(name) {};

MaxFlowCostsTest::~MaxFlowCostsTest(){
    for(auto v : vertices){
        delete v;
    }
}

void MaxFlowCostsTest::Run() {
    vector<tuple<int,int,float>> used_edges;

    float barleyMaxFlow = 0;
    float barleyMinCost = maxFlowSolver->minCostMaxFlow(used_edges,vertices,barleyMaxFlow);
    if(answer.barleyMaxFlow != -1) {
        cout << "MaxFlowBarley: "<< barleyMaxFlow << " expects: " << answer.barleyMaxFlow;

        if (barleyMaxFlow == answer.barleyMaxFlow) {
            cout << " [✓]" << endl;
        } else {
            errors++;
            cout << " [X]" << endl;
        }
    }

    int i = 0;
    if(answer.barleyPaths.size()) {
        if(answer.barleyPaths.size() != used_edges.size()){
            cout << "[ERROR] Wrong amount of barley paths! paths: " << used_edges.size() << " expects: " << answer.barleyPaths.size() << endl;
            errors++;
        }
        for (auto [u, v, f]: used_edges) {
            cout << i << ": " << u << " -> " << v << " : " << f;
            if (u != get<0>(answer.barleyPaths[i]) || v != get<1>(answer.barleyPaths[i]) || f != get<2>(answer.barleyPaths[i])) {
                cout << " [X] expects: " << i << ": " << get<0>(answer.barleyPaths[i]) << " -> " << get<1>(answer.barleyPaths[i])
                     << " : " << get<2>(answer.barleyPaths[i]) << endl;
            } else {
                cout << " [✓]" << endl;
            }
            i++;
        }
    }

    float beerMaxFlow = 0;
    maxFlowSolver->isBeerCreated = true;
    float beerMinCost = maxFlowSolver->minCostMaxFlow(used_edges,vertices,beerMaxFlow);

    used_edges.clear();
    if(answer.beerMaxFlow != -1) {
        cout << "MaxBeerFlow: "<< beerMaxFlow << " expects: " << answer.beerMaxFlow;

        if (beerMaxFlow == answer.beerMaxFlow) {
            cout << " [✓]" << endl;
        } else {
            errors++;
            cout << " [X]" << endl;
        }
    }

    i = 0;
    if(answer.beerPaths.size()) {
        if(answer.beerPaths.size() != used_edges.size()){
            cout << "[ERROR] Wrong amount of beer paths! paths: " << used_edges.size() << " expects: " << answer.beerPaths.size() << endl;
            errors++;
        }
        for (auto [u, v, f]: used_edges) {
            cout << i << ": " << u << " -> " << v << " : " << f;
            if (u != get<0>(answer.beerPaths[i]) || v != get<1>(answer.beerPaths[i]) || f != get<2>(answer.beerPaths[i])) {
                cout << " [X] expects: " << i << ": " << get<0>(answer.beerPaths[i]) << " -> " << get<1>(answer.beerPaths[i])
                     << " : " << get<2>(answer.beerPaths[i]) << endl;
            } else {
                cout << " [✓]" << endl;
            }
            i++;
        }
    }

    cout << "barleyMinCost: " << barleyMinCost << "\n"
    << "beerMinCost: " << beerMinCost << '\n';
}