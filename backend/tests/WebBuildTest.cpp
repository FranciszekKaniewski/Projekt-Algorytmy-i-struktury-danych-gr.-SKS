#include "./headers/WebBuildTest.hpp"

float WebBuildTest::parseValue(const string& token) {
    if (token == "INF") return 1.41007e+09;
    return stof(token);
}

bool WebBuildTest::CompareArrays(vector<int>& a, vector<int>& b)
{
    if (a.size() != b.size())
        return false;

    vector<int> sortedA = a;
    vector<int> sortedB = b;

    sort(sortedA.begin(), sortedA.end());
    sort(sortedB.begin(), sortedB.end());

    return sortedA == sortedB;
}

bool WebBuildTest::areAlmostEqual(float a, float b, float epsilon = 1e-3f) {
    return std::fabs(a - b) <= epsilon * std::max(std::fabs(a), std::fabs(b));
}

WebBuildTest::WebBuildTest(MaxFlowSolver* maxFlowSolver, WebBuildTest_Answers answers, std::string name) : maxFlowSolver(maxFlowSolver), answers(answers), Test(name) {}

void WebBuildTest::Run() {
    if(answers.expectedSource != -1) {
        cout << "Source: " << maxFlowSolver->source << " expects: " << answers.expectedSource;
        if (answers.expectedSource == maxFlowSolver->source) {
            cout << " [✓]" << endl;
        } else {
            errors++;
            cout << " [X]" << endl;
        }
    }

    if(answers.expectedBarleySink != -1) {
        cout << "BarleySink: " << maxFlowSolver->barleySink << " expects: " << answers.expectedBarleySink;
        if (answers.expectedBarleySink == maxFlowSolver->barleySink) {
            cout << " [✓]" << endl;
        } else {
            errors++;
            cout << " [X]" << endl;
        }
    }

    if(answers.expectedSink != -1) {
        cout << "Sink: " << maxFlowSolver->sink << " expects: " << answers.expectedSink;
        if (answers.expectedSink == maxFlowSolver->sink) {
            cout << " [✓]" << endl;
        } else {
            errors++;
            cout << " [X]" << endl;
        }
    }


    cout << "IsBeerCreated: " << maxFlowSolver->isBeerCreated << " expects: " << answers.expectedIsBeerCreated;
    if (answers.expectedIsBeerCreated == maxFlowSolver->isBeerCreated) {
        cout << " [✓]" << endl;
    } else {
        errors++;
        cout << " [X]" << endl;
    }

    bool passed = true;
    int i = 0;

    if(answers.expectedCapacity.size()) {
        cout << " === Capacity === " << endl;
        i = 0;
        for (vector<float> arr: maxFlowSolver->capacity) {
            passed = true;
            cout << i << " [ ";
            int j = 0;
            for (float value: arr) {
                if (!areAlmostEqual(value, answers.expectedCapacity[i][j])) {
                    cout << " [!!!] ERROR: value: " << value << " expected value: " << answers.expectedCapacity[i][j]
                         << " | ";
                    errors++;
                    passed = false;
                } else {
                    cout << (areAlmostEqual(value, 1.41007e+09) ? "INF" : to_string(value)) << " | ";
                }
                j++;
            }
            cout << (passed ? " ] [✓]" : " ] [X]") << endl;
            i++;
        }
    }

    if(answers.expectedFlowPassed.size()) {
        i = 0;
        cout << " === FlowPassed === " << endl;
        for (vector<float> arr: maxFlowSolver->flowPassed) {
            passed = true;
            cout << i << " [ ";
            int j = 0;
            for (float value: arr) {
                if (!areAlmostEqual(value, answers.expectedFlowPassed[i][j])) {
                    cout << " [!!!] ERROR: value: " << value << " expected value: " << answers.expectedFlowPassed[i][j]
                         << " | ";
                    errors++;
                    passed = false;
                } else {
                    cout << (areAlmostEqual(value, 1.41007e+09) ? "INF" : to_string(value)) << " | ";
                }
                j++;
            }
            cout << (passed ? " ] [✓]" : " ] [X]") << endl;
            i++;
        }
    }

    if(answers.expectedAdj.size()) {
        i = 0;
        cout << " === Adj === " << endl;
        for (vector<int> arr: maxFlowSolver->adj) {
            passed = true;
            cout << i << " [ ";
            if (CompareArrays(arr, answers.expectedAdj[i])) {
                for (int e: arr) cout << e << " | ";
            } else {
                for (int e: arr) cout << e << " | ";
                passed = false;
            }
            cout << (passed ? " ] [✓]" : " ] [X]") << endl;
            i++;
        }
    }
}