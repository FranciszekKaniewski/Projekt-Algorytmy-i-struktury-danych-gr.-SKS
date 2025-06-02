#include "./headers/KMPSolver.hpp"


vector<KMPAns> KMPSolver::KMP() {
    vector<KMPAns> wyniki;
    istringstream iss(tekst);
    string linia;
    int numer_linii = 1;

    while (getline(iss, linia)) {
    vector<int> trafienia = kmpSearch(linia, patern);
        for (int indeks : trafienia) {
            KMPAns wynik;
            wynik.row = numer_linii;
            wynik.column = indeks;
            wynik.length = length;
            wynik.lineText = linia;
            wyniki.push_back(wynik);
        }
      numer_linii++;
    }

    return wyniki;    
}

vector<int> KMPSolver::kmpPrefixTable(const string& pattern){
    int m = pattern.size();
    vector<int> prefix(m, 0);
    int j = 0;

    for (int i = 1; i < m; ++i) {
        while (j > 0 && pattern[i] != pattern[j])
            j = prefix[j - 1];
        if (pattern[i] == pattern[j])
            j++;
        prefix[i] = j;
    }

    return prefix;
}

vector<int> KMPSolver::kmpSearch(const string& line, const string& pattern) {
    vector<int> positions;
    vector<int> prefix = kmpPrefixTable(pattern);
    int n = line.size();
    int m = pattern.size();
    int j = 0;

    for (int i = 0; i < n; ++i) {
        while (j > 0 && line[i] != pattern[j])
            j = prefix[j - 1];
        if (line[i] == pattern[j])
            j++;
        if (j == m) {
            positions.push_back(i - m + 1);
            j = prefix[j - 1];
        }
    }

    return positions;
}