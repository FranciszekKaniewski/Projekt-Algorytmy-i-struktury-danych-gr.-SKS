#include <iostream>
#include <vector>
#include <sstream>

using namespace std;

struct KMPAns {
    int row;
    int column;
    int length;
    wstring lineText;
};

class KMPSolver {
private:
    wstring tekst;
    wstring patern;
    int length;

    vector<int> kmpPrefixTable(const wstring& pattern);
    vector<int> kmpSearch(const wstring& line, const wstring& pattern);

public:
    KMPSolver(const wstring& tekst, const wstring& patern): tekst(tekst), patern(patern), length(patern.length()) {}

    vector<KMPAns> KMP(); 
};
