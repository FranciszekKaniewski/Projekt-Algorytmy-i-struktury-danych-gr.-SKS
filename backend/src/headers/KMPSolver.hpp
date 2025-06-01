#include <iostream>
#include <vector>
#include <sstream>

using namespace std;

struct KMPAns {
    int row;
    int column;
    int length;
    string lineText;
};

class KMPSolver {
private:
    string tekst;
    string patern;
    int length;

    vector<int> kmpPrefixTable(const string& pattern);

    vector<int> kmpSearch(const string& line, const string& pattern);

public:
    KMPSolver(const string& tekst, const string& patern): tekst(tekst), patern(patern), length(patern.length()) {}

    vector<KMPAns> KMP(); 
};