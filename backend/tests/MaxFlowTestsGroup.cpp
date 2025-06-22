#include "./headers/MaxFlowTestsGroup.hpp"

void MaxFlowTestGroup::LoadData(std::string fileName) {
    fstream testFile("/app/tests/TESTS-FILES/" + fileName);
    if (!testFile.is_open()) {
        cout << "File error: " << fileName << endl;
        return;
    }

    MaxFlowTest_Answer ans;
    ans.barleyMaxFlow = -1;
    ans.beerMaxFlow = -1;

    std::vector<Vertex*> vertices;
    std::vector<Edge*> edges;

    const std::string WHITESPACE = " \t\n\r\f\v";
    string line;
    while (getline(testFile, line)) {
        if (line.empty() || line[0] == '#' || line.find_first_not_of(WHITESPACE) == std::string::npos) continue;

        vector <string> words;
        istringstream iss(line);

        string word;
        while (iss >> word) {
            words.push_back(word);
        }

        if(words[0] == "F") vertices.push_back(new Field(stod(words[1]), stod(words[2]), stod(words[3])));
        else if(words[0] == "C") vertices.push_back(new Cross(stod(words[1]), stod(words[2]), stod(words[3])));
        else if(words[0] == "B") vertices.push_back(new Brewery(stod(words[1]), stod(words[2])));
        else if(words[0] == "I") vertices.push_back(new Inn(stod(words[1]), stod(words[2])));
        else if(words[0] == "E") edges.push_back(new Edge(vertices[stoi(words[1])], vertices[stoi(words[2])], stod(words[3])));
        else if(words[0] == "Barley:"){
            ans.barleyMaxFlow =  stof(words[1]);
        }
        else if(words[0] == "Beer:"){
            ans.beerMaxFlow =  stof(words[1]);
        }
        else if(words[0] == "BarleyPath"){
            ans.barleyPaths.push_back({stoi(words[1]),stoi(words[2]),stof(words[3])});
        }
        else if(words[0] == "BeerPath"){
            ans.beerPaths.push_back({stoi(words[1]),stoi(words[2]),stof(words[3])});
        }
        else if(words[0] == "END") {

            MaxFlowSolver* maxFlowSolver = new MaxFlowSolver(vertices,edges);

            Test* test = !costs
                        ? static_cast<Test*>(new MaxFlowTest(maxFlowSolver, ans, "MaxFlowTest", vertices))
                        : static_cast<Test*>(new MaxFlowCostsTest(maxFlowSolver, ans, "MaxFlowWithCostsTest", vertices));

            addSingleTest(test);

            for (auto e : edges) delete e;

            Vertex::counter = 0;
            Edge::freeId = 0;

            vertices.clear();
            edges.clear();

            ans = MaxFlowTest_Answer();
            ans.barleyMaxFlow = -1;
            ans.beerMaxFlow = -1;
        }
    }
}