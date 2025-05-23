#include "./headers/WebBuildTestsGroup.hpp"

void WebBuildTestsGroup::LoadData(string fileName) {
    fstream testFile("/app/tests/TESTS-FILES/" + fileName);
    if (!testFile.is_open()) {
        cout << "File error: " << fileName << endl;
        return;
    }

    std::vector<Vertex*> vertices;
    std::vector<Edge*> edges;

    WebBuildTest_Answers ans;
    ans.expectedSource = -1;
    ans.expectedSink = -1;
    ans.expectedBarleySink = -1;


    const std::string WHITESPACE = " \t\n\r\f\v";
    string line;
    while (getline(testFile, line)) {
        if(line.empty() || line[0] == '#' || line.find_first_not_of(WHITESPACE) == std::string::npos) continue;

        vector<string> words;
        istringstream iss(line);

        string word;
        while (iss >> word) {
            words.push_back(word);
        }

        if(words[0] == "F") vertices.push_back(new Field(stod(words[1]), stod(words[2]), stod(words[3])));
        else if(words[0] == "C") vertices.push_back(new Cross(stod(words[1]), stod(words[2]), stod(words[3])));
        else if(words[0] == "B") vertices.push_back(new Brewery(stod(words[1]), stod(words[2])));
        else if(words[0] == "I") vertices.push_back(new Inn(stod(words[1]), stod(words[2])));
        else if(words[0] == "E") edges.push_back(new Edge(vertices[stoi(words[1])], vertices[stoi(words[2])]));
        else if(words[0] == "Source:") ans.expectedSource = stoi(words[1]);
        else if(words[0] == "BarleySink:") ans.expectedBarleySink = stoi(words[1]);
        else if(words[0] == "Sink:") ans.expectedSink = stoi(words[1]);
        else if(words[0] == "isBeerReady:") ans.expectedIsBeerCreated = stoi(words[1]);
        else if(words[0] == "Capacity"){
            ans.expectedCapacity.resize(stoi(words[1])+1);
            for(int i=3;i<words.size();i++){
                if(words[i] == "INF") words[i] = "1.41007e+09";
                ans.expectedCapacity[stoi(words[1])].push_back(stod(words[i]));
            }
        }
        else if(words[0] == "FlowPassed"){
            ans.expectedFlowPassed.resize(stoi(words[1])+1);
            for(int i=3;i<words.size();i++){
                if(words[i] == "INF") words[i] = "1.41007e+09";
                ans.expectedFlowPassed[stoi(words[1])].push_back(stod(words[i]));
            }
        }
        else if(words[0] == "Adj"){
            ans.expectedAdj.resize(stoi(words[1])+1);
            for(int i=3;i<words.size();i++){
                ans.expectedAdj[stoi(words[1])].push_back(stod(words[i]));
            }
        }

        else if(words[0] == "END"){

            int n = vertices.size() + 3;
            bool skip = false;
            if((ans.expectedAdj.size() != n && ans.expectedAdj.size() != 0)
            || (ans.expectedCapacity.size() != n && ans.expectedCapacity.size() != 0)
            || (ans.expectedFlowPassed.size() != n && ans.expectedFlowPassed.size() != 0)
            ) {
                skip = true;
            }

            for(auto e : ans.expectedFlowPassed){
                if(e.size() != n) skip = true;
            }
            for(auto e : ans.expectedCapacity){
                if(e.size() != n) skip = true;
            }

            if(skip){
                cout<<"\n ERROR loading data from a test nr." << testNumber << endl;
            }else{
                MaxFlowSolver* maxFlowSolver = new MaxFlowSolver(vertices,edges);

                WebBuildTest* wbt = new WebBuildTest(maxFlowSolver,ans,"WebBuildTest");
                addSingleTest(wbt);
            }

            testNumber ++;

            for (auto v : vertices) delete v;
            for (auto e : edges) delete e;

            Vertex::counter = 0;
            Edge::freeId = 0;

            vertices.clear();
            edges.clear();

            ans = WebBuildTest_Answers();
            ans.expectedSource = -1;
            ans.expectedSink = -1;
            ans.expectedBarleySink = -1;
        }
    }
}

